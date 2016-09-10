function PauseMenu(){
    Menu.call(this);

    this.bg = 'rgba(0,0,0,.5)';

    this.button(button(nomangle('resume')), 0, 420, G.resume);

    var soundOn = button(nomangle('mute'));
    var soundOff = button(nomangle('unmute'));

    var buttonType = function(){
        return SoundManager.muted ? soundOff : soundOn;
    };

    this.button(buttonType(), 0, 560, function(){
        SoundManager.muted = !SoundManager.muted;
        this.d = buttonType();
    });

    this.button(button(nomangle('menu')), 0, 700, G.mainMenu);

    this.animateButtons();

    var titleX = (CANVAS_WIDTH - 460) / 2;
    this.button(cache(460, 230, function(r){
    	drawText(r, 'game', 80, 10, 20, '#444');
    	drawText(r, 'game', 80, 0, 20, '#fff');

    	drawText(r, 'paused', 0, 130, 20, '#444');
    	drawText(r, 'paused', 0, 120, 20, '#fff');
    }), titleX, 90);
}
