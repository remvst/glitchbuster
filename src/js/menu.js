function Menu(){
    this.buttons = [];

    this.button = function(d, x, y, a){
        this.buttons.push({
            d: d, // drawable
            x: x,
            y: y,
            a: a // action
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
            drawImage(b.d, b.x, b.y);
        });
    };
}

function MainMenu(){
    Menu.call(this);

    this.button(playButton, 0, 460, function(){
        G.newGame();
    });
    this.button(tutorialButton, 0, 600, function(){
        G.newGame(true);
    });

    var titleX = (CANVAS_WIDTH - title.width) / 2;
    this.button(title, titleX, titleX);
}
