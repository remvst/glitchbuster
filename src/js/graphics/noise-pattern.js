var noisePattern = cachePattern(NOISE_PATTERN_SIZE, NOISE_PATTERN_SIZE, function(r){
    with(r){
        fillStyle = '#000';
        fillRect(0, 0, NOISE_PATTERN_SIZE, NOISE_PATTERN_SIZE);

        fillStyle = '#fff';

        for(var x = 0 ; x < NOISE_PATTERN_SIZE ; x += NOISE_PIXEL_SIZE){
            for(var y = 0 ; y < NOISE_PATTERN_SIZE ; y += NOISE_PIXEL_SIZE){
                globalAlpha = rand();
                fillRect(x, y, NOISE_PIXEL_SIZE, NOISE_PIXEL_SIZE);
            }
        }
    }
});
