function GameOverMenu(reason){
    Menu.call(this);

    this.button(button(nomangle('retry')), 0, 420, function(){
        G.newGame();
    });
    this.button(button(nomangle('back')), 0, 560, function(){
        G.mainMenu();
    });

    var b;
    this.button(button(nomangle('foo')), 0, 700, function(){
        this.d = button((b = !b) ? 'bar' : 'foo');
    });

    this.animateButtons();

    var ss = {
        GAME_OVER_DEATH: [nomangle('critical'), nomangle('mental health')],
        GAME_OVER_TIME: [nomangle('time'), nomangle('expired')],
        GAME_OVER_SUCCESS: [nomangle('code fixed'), '!!!']
    }[reason];

    if(reason == GAME_OVER_SUCCESS){
        ss.push(nomangle('time: ') + formatTime(G.totalTime));
    }else{
        ss.push(nomangle('fixed ') + (G.currentLevel - 1) + '/13');
    }

    var s1 = ss[0],
        t1 = 10,
        w1 = requiredCells(s1) * t1,
        s2 = ss[1],
        t2 = 10,
        w2 = requiredCells(s2) * t2,
        s3 = ss[2],
        t3 = 5,
        w3 = requiredCells(s3) * t3;

    this.button(cache(w1, t1 * 5 + 5, function(r){
    	drawText(r, s1, 0, 5, t1, '#444');
        drawText(r, s1, 0, 0, t1, '#fff');
    }), (CANVAS_WIDTH - w1) / 2, 120);

    this.button(cache(w2, t2 * 5 + 5, function(r){
        drawText(r, s2, 0, 5, t2, '#444');
        drawText(r, s2, 0, 0, t2, '#fff');
    }), (CANVAS_WIDTH - w2) / 2, 200);

    this.button(cache(w3, t3 * 5 + 5, function(r){
        drawText(r, s3, 0, 5, t3, '#444');
        drawText(r, s3, 0, 0, t3, '#fff');
    }), (CANVAS_WIDTH - w3) / 2, 280);
}
