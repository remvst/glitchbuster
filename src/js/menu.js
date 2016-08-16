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
                b.a.call(b);
            }
        });
    };

    this.render = function(){
        R.globalAlpha = this.alpha;

        R.fillStyle = '#000';
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        var a = this.alpha;
        this.buttons.forEach(function(b){
            R.globalAlpha = a * b.o;
            drawImage(b.d, b.x, b.y);
        });

        R.globalAlpha = 1;
    };
}

function MainMenu(){
    Menu.call(this);

    this.button(button(string('learn')), 0, 420, function(){
        G.newGame(true);
    });
    this.button(button(string('start')), 0, 560, function(){
        G.newGame();
    });
    this.button(button(string('whois')), 0, 700, function(){
        open(string('http://twitter.com/remvst'));
    });

    this.buttons.forEach(function(b, i){
        interp(b, 'x', -b.d.width, 0, 0.25, i * 0.25 + 0.5);
    });

    var titleX = (CANVAS_WIDTH - 460) / 2;
    this.button(cache(460, 230, function(c, r){
    	drawText(r, 'glitch', 0, 10, 20, '#444');
    	drawText(r, 'glitch', 0, 0, 20, '#fff');

    	drawText(r, 'buster', 0, 130, 20, '#444');
    	drawText(r, 'buster', 0, 120, 20, '#fff');
    }), titleX, titleX);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}

function GameOverMenu(){
    Menu.call(this);

    this.button(button(string('retry')), 0, 420, function(){
        G.newGame();
    });
    this.button(button(string('back')), 0, 560, function(){
        G.mainMenu();
    });

    var b;
    this.button(button(string('foo')), 0, 700, function(){
        this.d = button((b = !b) ? 'bar' : 'foo');
    });

    this.buttons.forEach(function(b, i){
        interp(b, 'x', -b.d.width, 0, 0.25, i * 0.25 + 0.5);
    });

    var s1 = string('busted glitches'),
        t1 = 5,
        w1 = s1.length * 3 * t1 + (s1.length - 1) * t1,
        s2 = (G.currentLevel - 1).toString(),
        t2 = 20,
        w2 = s2.length * 3 * t2 + (s2.length - 1) * t2;

    this.button(cache(w1, t1 * 5 + 5, function(c, r){
    	drawText(r, s1, 0, 5, t1, '#444');
        drawText(r, s1, 0, 0, t1, '#fff');
    }), (CANVAS_WIDTH - w1) / 2, 120);

    this.button(cache(w2, t2 * 5 + 10, function(c, r){
        drawText(r, s2, 0, 10, t2, '#444');
        drawText(r, s2, 0, 0, t2, '#fff');
    }), (CANVAS_WIDTH - w2) / 2, 200);
}
