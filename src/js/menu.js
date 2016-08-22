function Menu(){
    this.buttons = [];

    this.alpha = 1;

    this.button = function(d, x, y, a){
        this.buttons.push({
            d: d, // drawable
            x: x,
            y: y,
            a: a, // action
            o: 1 // opacity
        });
    };

    this.click = function(x, y){
        this.buttons.forEach(function(b){
            if(x > b.x && y > b.y && x < b.x + b.d.width && y < b.y + b.d.height && b.a){
                menuSound.play();
                b.a.call(b);
            }
        });
    };

    this.render = function(){
        R.globalAlpha = this.alpha;

        R.fillStyle = codePattern;
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        var a = this.alpha;
        this.buttons.forEach(function(b){
            R.globalAlpha = a * b.o;
            drawImage(b.d, b.x, b.y);
        });

        R.globalAlpha = 1;
    };

    this.animateButtons = function(){
        this.buttons.forEach(function(b, i){
            interp(b, 'x', -b.d.width, 0, 0.25, i * 0.25 + 0.5);
        });
    };
}

function MainMenu(){
    Menu.call(this);

    this.button(button(nomangle('learn')), 0, 420, function(){
        G.newGame(true);
    });
    this.button(button(nomangle('start')), 0, 560, function(){
        G.newGame();
    });
    this.button(button(nomangle('whois')), 0, 700, function(){
        open(nomangle('http://twitter.com/remvst'));
    });

    this.animateButtons();

    var titleX = (CANVAS_WIDTH - 460) / 2;
    this.button(cache(460, 230, function(c, r){
    	drawText(r, 'glitch', 0, 10, 20, '#444');
    	drawText(r, 'glitch', 0, 0, 20, '#fff');

    	drawText(r, 'buster', 0, 130, 20, '#444');
    	drawText(r, 'buster', 0, 120, 20, '#fff');
    }), titleX, titleX);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}

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

    this.button(cache(w1, t1 * 5 + 5, function(c, r){
    	drawText(r, s1, 0, 5, t1, '#444');
        drawText(r, s1, 0, 0, t1, '#fff');
    }), (CANVAS_WIDTH - w1) / 2, 120);

    this.button(cache(w2, t2 * 5 + 5, function(c, r){
        drawText(r, s2, 0, 5, t2, '#444');
        drawText(r, s2, 0, 0, t2, '#fff');
    }), (CANVAS_WIDTH - w2) / 2, 200);

    this.button(cache(w3, t3 * 5 + 5, function(c, r){
        drawText(r, s3, 0, 5, t3, '#444');
        drawText(r, s3, 0, 0, t3, '#fff');
    }), (CANVAS_WIDTH - w3) / 2, 280);
}
