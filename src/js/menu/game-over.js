function GameOverMenu(reason){
    Menu.call(this);

    var ss = [
        [nomangle('critical'), nomangle('mental health')],
        [nomangle('time'), nomangle('expired')],
        [nomangle('code fixed'), '!!!']
    ][reason];

    var t = formatTime(G.totalTime);

    this.button(button(nomangle('retry')), 0, 420, G.newGame);
    this.button(button(nomangle('back')), 0, 560, G.mainMenu);
    this.button(button(nomangle('share')), 0, 700, function(){
        open(nomangle('//twitter.com/intent/tweet?') +
            nomangle('hashtags=js13k') +
            nomangle('&url=') + encodeURIComponent(nomangle('http://js13kgames.com/entries/glitchbuster')) +
            nomangle('&text=') + encodeURIComponent(
                (reason == GAME_OVER_SUCCESS ? nomangle('I fixed all glitches in ') + t : nomangle('I fixed ') + (G.currentLevel - 1) + nomangle('/13 glitches')) + nomangle(' on Glitchbuster!')
            )
        );
    });

    /*var b;
    this.button(button(nomangleing('foo')), 0, 700, function(){
        this.d = button((b = !b) ? 'bar' : 'foo');
    });*/

    this.animateButtons();

    ss.push(reason == GAME_OVER_SUCCESS ? nomangle('time: ') + t : nomangle('fixed ') + (G.currentLevel - 1) + '/13');

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
