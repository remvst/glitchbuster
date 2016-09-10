function PauseMenu(){
    Menu.call(this);

    this.bg = 'rgba(0,0,0,.5)';

    this.button(button(nomangle('resume')), 0, 280, G.resume);

    this.button(SoundManager.button(), 0, 420, function(){
        SoundManager.muted = !SoundManager.muted;
        this.d = SoundManager.button();
    });

    this.button(button(nomangle('hires', 0, '?')), 0, 560, function(){
        G.setShittyMode(!shittyMode); // toggle shitty mode
        this.o = shittyMode ? 0.5 : 1; // set the button opacity based on the mode
    });

    this.button(button(nomangle('menu')), 0, 700, function(){
        if(confirm(nomangle('Progress will be lost'))){
            G.mainMenu();
        }
    });

    this.animateButtons();

    var titleX = (CANVAS_WIDTH - 460) / 2;
    this.button(cache(460, 110, function(r){
        //drawText(r, 'game', 80, 10, 20, '#444');
        //drawText(r, 'game', 80, 0, 20, '#fff');

        drawText(r, nomangle('paused'), 0, 10, 20, '#444');
        drawText(r, nomangle('paused'), 0, 0, 20, '#fff');
    }), titleX, 90);
}
