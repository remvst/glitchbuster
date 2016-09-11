function MainMenu(){
    Menu.call(this);

    this.button(button(nomangle('start')), 0, 420, G.newGame);

    this.button(SoundManager.button(), 0, 560, function(){
        SoundManager.muted = !SoundManager.muted;
        this.d = SoundManager.button();
    });

    this.button(button(nomangle('hires'), '?'), 0, 700, function(){
        G.setShittyMode(!shittyMode); // toggle shitty mode
        this.o = shittyMode ? 0.5 : 1; // set the button opacity based on the mode
    }).o = shittyMode ? 0.5 : 1;

    this.animateButtons();

    var titleX = (CANVAS_WIDTH - 460) / 2;
    this.button(cache(460, 230, function(r){
        drawText(r, 'glitch', 0, 10, 20, '#444');
        drawText(r, 'glitch', 0, 0, 20, '#fff');

        drawText(r, 'buster', 0, 130, 20, '#444');
        drawText(r, 'buster', 0, 120, 20, '#fff');
    }), titleX, 90/*, function(){
        // Got spare bites, so yolo
        interp(this, 'o', 0, 1, 0.4);
    }*/);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}
