var SoundManager = {
    'sounds': [],
    'muted': false,
    'prepare': function(settings){
        var sound = jsfxr(settings);
        return function(){
            if(!SoundManager.muted){
                sound.play();
            }
        };
    },
    'button': function(){
        return button(SoundManager.muted ? nomangle('unmute') : nomangle('mute'));
    }
};
