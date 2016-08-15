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
                b.a();
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

    this.button(button('learn'), 0, 420, function(){
        G.newGame(true);
    });
    this.button(button('start'), 0, 560, function(){
        G.newGame();
    });
    this.button(button('whois'), 0, 700, function(){
        open('http://twitter.com/remvst');
    });

    this.buttons.forEach(function(b, i){
        interp(b, 'x', -b.d.width, 0, 0.25, i * 0.25 + 0.5);
    });

    var titleX = (CANVAS_WIDTH - title.width) / 2;
    this.button(title, titleX, titleX);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}

function GameOverMenu(){
    Menu.call(this);

    this.button(button('retry'), 0, 420, function(){
        G.newGame();
    });
    this.button(button('back'), 0, 560, function(){
        G.mainMenu();
    });

    this.buttons.forEach(function(b, i){
        interp(b, 'x', -b.d.width, 0, 0.25, i * 0.25 + 0.5);
    });

    var titleX = (CANVAS_WIDTH - title.width) / 2;
    this.button(title, titleX, titleX);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}
