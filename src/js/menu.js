function Menu(){
    this.buttons = [];

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
        R.fillStyle = '#000';
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        this.buttons.forEach(function(b){
            R.globalAlpha = b.o;
            drawImage(b.d, b.x, b.y);
        });

        R.globalAlpha = 1;
    };
}

function MainMenu(){
    Menu.call(this);

    this.button(tutorialButton, 0, 420, function(){
        G.newGame(true);
    });
    this.button(playButton, 0, 560, function(){
        G.newGame();
    });
    this.button(authorButton, 0, 700, function(){
        open('http://twitter.com/remvst');
    });

    this.buttons.forEach(function(b, i){
        interp(b, 'x', -b.d.width, 0, 0.25, i * 0.25 + 0.5);
    });

    var titleX = (CANVAS_WIDTH - title.width) / 2;
    this.button(title, titleX, titleX);

    interp(this.buttons[this.buttons.length - 1], 'o', 0, 1, 0.25, 0.5);
}
