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
        if(this.alpha == 1){
            this.buttons.forEach(function(b){
                if(x > b.x && y > b.y && x < b.x + b.d.width && y < b.y + b.d.height){
                    menuSound.play();
                    b.a.call(b);
                }
            });
        }
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
