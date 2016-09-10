function MainMenu(){
    Menu.call(this);

    this.button(button(nomangle('learn')), 0, 420, G.tutorial);
    this.button(button(nomangle('start')), 0, 560, G.newGame);

    var soundOn = button(nomangle('mute'));
    var soundOff = button(nomangle('unmute'));

    var buttonType = function(){
        return SoundManager.muted ? soundOff : soundOn;
    };

    this.button(buttonType(), 0, 700, function(){
        SoundManager.muted = !SoundManager.muted;
        this.d = buttonType();
    });

    /*this.button(button(_nomangle('whois')), 0, 840, function(){
        open(nomangle('//goo.gl/QRxjGP'));
    });*/

    this.animateButtons();

    var titleX = (CANVAS_WIDTH - 460) / 2;
    this.button(cache(460, 230, function(r){
    	drawText(r, 'glitch', 0, 10, 20, '#444');
    	drawText(r, 'glitch', 0, 0, 20, '#fff');

    	drawText(r, 'buster', 0, 130, 20, '#444');
    	drawText(r, 'buster', 0, 120, 20, '#fff');
    }), titleX, 90);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}
