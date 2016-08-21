// Wave shapes
// TODO move to config constants
var SQUARE = 0,
    SAWTOOTH = 1,
    SINE = 2,
    NOISE = 3;


// Playback volume
var masterVolume = 1;


var OVERSAMPLING = 8;


var defaultKnobs = {
    shape: SQUARE, // SQUARE/SAWTOOTH/SINE/NOISE

    attack:  0,   // sec
    sustain: 0.2, // sec
    punch:   0,   // proportion
    decay:   0.2, // sec

    frequency:        1000, // Hz
    frequencyMin:        0, // Hz
    frequencySlide:      0, // 8va/sec
    frequencySlideSlide: 0, // 8va/sec/sec

    vibratoDepth:  0, // proportion
    vibratoRate:  10, // Hz

    arpeggioFactor: 1,   // multiple of frequency
    arpeggioDelay:  0.1, // sec

    dutyCycle:      0.5, // proportion of wavelength
    dutyCycleSweep: 0,   // proportion/second

    retriggerRate: 0, // Hz

    flangerOffset: 0, // sec
    flangerSweep:  0, // offset/sec

    lowPassFrequency: 44100, // Hz
    lowPassSweep:     1,     // ^sec
    lowPassResonance: 0.5,   // proportion

    highPassFrequency: 0, // Hz
    highPassSweep:     0, // ^sec

    gain: -10, // dB

    sampleRate: 44100, // Hz
    sampleSize: 8,     // bits per channel
};

function convert(a){
    return {
        shape: SQUARE, // SQUARE/SAWTOOTH/SINE/NOISE

        attack:  0,   // sec
        sustain: 0.2, // sec
        punch:   0,   // proportion
        decay:   0.2, // sec

        frequency:        1000, // Hz
        frequencyMin:        0, // Hz
        frequencySlide:      0, // 8va/sec
        frequencySlideSlide: 0, // 8va/sec/sec

        vibratoDepth:  0, // proportion
        vibratoRate:  10, // Hz

        arpeggioFactor: 1,   // multiple of frequency
        arpeggioDelay:  0.1, // sec

        dutyCycle:      0.5, // proportion of wavelength
        dutyCycleSweep: 0,   // proportion/second

        retriggerRate: 0, // Hz

        flangerOffset: 0, // sec
        flangerSweep:  0, // offset/sec

        lowPassFrequency: 44100, // Hz
        lowPassSweep:     1,     // ^sec
        lowPassResonance: 0.5,   // proportion

        highPassFrequency: 0, // Hz
        highPassSweep:     0, // ^sec

        gain: -10, // dB

        sampleRate: 44100, // Hz
        sampleSize: 8,     // bits per channel
    }
}



function SoundEffect(ps) {
    //
    // Convert user-facing parameter values to units usable by the sound
    // generator
    //

    this.elapsedSinceRepeat = 0;

    this.period = OVERSAMPLING * 44100 / ps.frequency;
    this.periodMax = OVERSAMPLING * 44100 / ps.frequencyMin;
    this.enableFrequencyCutoff = (ps.frequencyMin > 0);
    this.periodMult = Math.pow(0.5, ps.frequencySlide / 44100);
    this.periodMultSlide = ps.frequencySlideSlide * Math.pow(2, -44101/44100) / 44100;

    this.dutyCycle = ps.dutyCycle;
    this.dutyCycleSlide = ps.dutyCycleSweep / (OVERSAMPLING * 44100);

    this.arpeggioMultiplier = 1 / ps.arpeggioFactor;
    this.arpeggioTime = ps.arpeggioDelay * 44100;

    // Waveform shape
    this.waveShape = ps.shape;

    // Low pass filter
    this.fltw = ps.lowPassFrequency / (OVERSAMPLING * 44100 + ps.lowPassFrequency);
    this.enableLowPassFilter = ps.lowPassFrequency < 44100;
    this.fltw_d = Math.pow(ps.lowPassSweep, 1/44100);
    this.fltdmp = (1 - ps.lowPassResonance) * 9 * (0.01 + this.fltw);

    // High pass filter
    this.flthp = ps.highPassFrequency / (OVERSAMPLING * 44100 + ps.highPassFrequency);
    this.flthp_d = Math.pow(ps.highPassSweep, 1/44100);

    // Vibrato
    this.vibratoSpeed = ps.vibratoRate * 64 / 44100 / 10;
    this.vibratoAmplitude = ps.vibratoDepth;

    // Envelope
    this.envelopeLength = [
        Math.floor(ps.attack * 44100),
        Math.floor(ps.sustain * 44100),
        Math.floor(ps.decay * 44100)
    ];
    this.envelopePunch = ps.punch;

    // Flanger
    this.flangerOffset = ps.flangerOffset * 44100;
    this.flangerOffsetSlide = ps.flangerSweep;

    // Repeat
    this.repeatTime = ps.retriggerRate ? 1 / (44100 * ps.retriggerRate) : 0;

    // Gain
    this.gain = Math.sqrt(Math.pow(10, ps.gain/10));

    this.sampleRate = ps.sampleRate;
    this.bitsPerChannel = ps.sampleSize;

    this.generate = function(){
        var fltp = 0,
            fltdp = 0,
            fltphp = 0;

        var noise_buffer = Array(32);
        for (var i = 0; i < 32; ++i){
            noise_buffer[i] = Math.random() * 2 - 1;
        }

        var envelopeStage = 0;
        var envelopeElapsed = 0;

        var vibratoPhase = 0;

        var phase = 0;
        var ipp = 0;
        var flanger_buffer = Array(1024);
        for (i = 0; i < 1024; ++i){
            flanger_buffer[i] = 0;
        }

        var num_clipped = 0;

        var buffer = [];

        var sample_sum = 0;
        var num_summed = 0;
        var summands = Math.floor(44100 / this.sampleRate);

        for(var t = 0; ; ++t) {

            // Repeats
            if (this.repeatTime != 0 && ++this.elapsedSinceRepeat >= this.repeatTime){
                this.initForRepeat();
            }

            // Arpeggio (single)
            if(this.arpeggioTime != 0 && t >= this.arpeggioTime) {
                this.arpeggioTime = 0;
                this.period *= this.arpeggioMultiplier;
            }

            // Frequency slide, and frequency slide slide!
            this.periodMult += this.periodMultSlide;
            this.period *= this.periodMult;
            if(this.period > this.periodMax) {
                this.period = this.periodMax;
                if (this.enableFrequencyCutoff)
                break;
            }

            // Vibrato
            var rfperiod = this.period;
            if (this.vibratoAmplitude > 0) {
                vibratoPhase += this.vibratoSpeed;
                rfperiod = this.period * (1 + Math.sin(vibratoPhase) * this.vibratoAmplitude);
            }
            var iperiod = Math.floor(rfperiod);
            if (iperiod < OVERSAMPLING) iperiod = OVERSAMPLING;

            // Square wave duty cycle
            this.dutyCycle += this.dutyCycleSlide;
            if (this.dutyCycle < 0) this.dutyCycle = 0;
            if (this.dutyCycle > 0.5) this.dutyCycle = 0.5;

            // Volume envelope
            if (++envelopeElapsed > this.envelopeLength[envelopeStage]) {
                envelopeElapsed = 0;
                if (++envelopeStage > 2)
                break;
            }
            var env_vol;
            var envf = envelopeElapsed / this.envelopeLength[envelopeStage];
            if (envelopeStage === 0) {         // Attack
                env_vol = envf;
            } else if (envelopeStage === 1) {  // Sustain
                env_vol = 1 + (1 - envf) * 2 * this.envelopePunch;
            } else {                           // Decay
                env_vol = 1 - envf;
            }

            // Flanger step
            this.flangerOffset += this.flangerOffsetSlide;
            var iphase = Math.abs(Math.floor(this.flangerOffset));
            if (iphase > 1023) iphase = 1023;

            if (this.flthp_d != 0) {
                this.flthp *= this.flthp_d;
                if (this.flthp < 0.00001)
                this.flthp = 0.00001;
                if (this.flthp > 0.1)
                this.flthp = 0.1;
            }

            // 8x oversampling
            var sample = 0;
            for (var si = 0; si < OVERSAMPLING; ++si) {
                var sub_sample = 0;
                phase++;
                if (phase >= iperiod) {
                    phase %= iperiod;
                    if (this.waveShape === NOISE)
                    for(var i = 0; i < 32; ++i)
                    noise_buffer[i] = Math.random() * 2 - 1;
                }

                // Base waveform
                var fp = phase / iperiod;
                if (this.waveShape === SQUARE) {
                    if (fp < this.dutyCycle)
                    sub_sample=0.5;
                    else
                    sub_sample=-0.5;
                } else if (this.waveShape === SAWTOOTH) {
                    if (fp < this.dutyCycle)
                    sub_sample = -1 + 2 * fp/this.dutyCycle;
                    else
                    sub_sample = 1 - 2 * (fp-this.dutyCycle)/(1-this.dutyCycle);
                } else if (this.waveShape === SINE) {
                    sub_sample = Math.sin(fp * 2 * Math.PI);
                } else if (this.waveShape === NOISE) {
                    sub_sample = noise_buffer[Math.floor(phase * 32 / iperiod)];
                } else {
                    throw "ERROR: Bad wave type: " + this.waveShape;
                }

                // Low-pass filter
                var pp = fltp;
                this.fltw *= this.fltw_d;
                if (this.fltw < 0) this.fltw = 0;
                if (this.fltw > 0.1) this.fltw = 0.1;
                if (this.enableLowPassFilter) {
                    fltdp += (sub_sample - fltp) * this.fltw;
                    fltdp -= fltdp * this.fltdmp;
                } else {
                    fltp = sub_sample;
                    fltdp = 0;
                }
                fltp += fltdp;

                // High-pass filter
                fltphp += fltp - pp;
                fltphp -= fltphp * this.flthp;
                sub_sample = fltphp;

                // Flanger
                flanger_buffer[ipp & 1023] = sub_sample;
                sub_sample += flanger_buffer[(ipp - iphase + 1024) & 1023];
                ipp = (ipp + 1) & 1023;

                // final accumulation and envelope application
                sample += sub_sample * env_vol;
            }

            // Accumulate samples appropriately for sample rate
            sample_sum += sample;
            if (++num_summed >= summands) {
                num_summed = 0;
                sample = sample_sum / summands;
                sample_sum = 0;
            } else {
                continue;
            }

            sample = sample / OVERSAMPLING * masterVolume;
            sample *= this.gain;

            if (this.bitsPerChannel === 8) {
                // Rescale [-1, 1) to [0, 256)
                sample = Math.floor((sample + 1) * 128);
                if (sample > 255) {
                    sample = 255;
                    ++num_clipped;
                } else if (sample < 0) {
                    sample = 0;
                    ++num_clipped;
                }
                buffer.push(sample);
            } else {
                // Rescale [-1, 1) to [-32768, 32768)
                sample = Math.floor(sample * (1<<15));
                if (sample >= (1<<15)) {
                    sample = (1 << 15)-1;
                    ++num_clipped;
                } else if (sample < -(1<<15)) {
                    sample = -(1 << 15);
                    ++num_clipped;
                }
                buffer.push(sample & 0xFF);
                buffer.push((sample >> 8) & 0xFF);
            }
        }

        var audio = new Audio();
        audio.src = new RIFFWAVE(buffer, this.sampleRate, this.bitsPerChannel).dataURI;
        return audio;
    };
}
