function MainMenu(){
    Menu.call(this);

    this.button(button(nomangle('learn')), (CANVAS_WIDTH - 440) / 2, 420, G.tutorial);
    this.button(button(nomangle('start')), (CANVAS_WIDTH - 440) / 2, 560, G.newGame);
    this.button(button(nomangle('whois')), (CANVAS_WIDTH - 440) / 2, 700, function(){
        open(nomangle('//goo.gl/QRxjGP'));
    });

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
