var SoundManager = {
    'sounds': [],
    'muted': false,
    'prepare': function(settings){
        var sound = jsfxr(settings);
        return {
            'play': function(){
                if(!SoundManager.muted){
                    sound.play();
                }
            }
        };
    }
};
