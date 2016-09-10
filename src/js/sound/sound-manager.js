var SoundManager = {
    'nextSoundId': 0,
    'sounds': [],
    'muted': false,
    'prepare': function(settings){
        var id = this.nextSoundId++;

        this.sounds[id] = [];
        for(var i in settings){
            var variationPool = [];
            this.sounds[id].push(variationPool);
            for(var j = 0 ; j < 3 ; j++){
                variationPool.push(jsfxr(settings[i]));
            }
        }

        return {
            'play': this.play.bind(this, id)
        };
    },
    'play': function(id){
        if(!this.muted){
            var variationPool = pick(this.sounds[id]); // select a random variation
            variationPool[0].play();
            variationPool.push(variationPool.shift()); // loop the pool
        }
    }
};
