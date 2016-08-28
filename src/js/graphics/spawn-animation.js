function SpawnAnimation(){
    this.alpha = 1;
    this.radius = 400;

    this.render = function(){
        R.globalAlpha = this.alpha;
        R.fillStyle = '#fff';
        beginPath();
        arc(P.x, P.y, this.radius, 0, PI * 2, true);
        fill();
        R.globalAlpha = 1;
    };

    var a = this;

    interp(this, 'radius', 400, 0, 0.4, 1);
    interp(this, 'alpha', 0, 1, 0.4, 1, null, function(){
        P.visible = true;

        for(var i = 0 ; i < 50 ; i++){
            var d = rand(0.5, 1.5),
                a = rand(-PI, PI),
                l = rand(10, 100),
                x = cos(a) * l + P.x,
                y = sin(a) * l + P.y - 50;

            particle(4, '#fff', [
                ['x', x, x, d, 0, oscillate],
                ['y', y, y + rand(100, 300), d, 0],
                ['s', rand(10, 20), 0, d]
            ], true);
        }
    });

    P.visible = P.controllable = false;
    P.talking = true;
    G.hideTiles = false;

    var cameraRightX = V.x + CANVAS_WIDTH,
        cameraBottomY = V.y + CANVAS_HEIGHT;

    for(var row = ~~(V.y / TILE_SIZE) ; row <  ~~(cameraBottomY / TILE_SIZE) + 1 ; row++){
        for(var col = ~~(V.x / TILE_SIZE) ; col <  ~~(cameraRightX / TILE_SIZE) + 1 ; col++){
            if(W.tiles[row] && W.tiles[row][col]){
                (function(t){
                    var r = dist(t.center, P);
                    t.hidden = true;
                    setTimeout(function(){
                        t.hidden = false;
                    }, 1000 + r / CANVAS_WIDTH * 400);
                })(W.tiles[row][col]);
            }
        }
    }

    var tUnlock = 500;
    if(!G.currentLevel){
        T(function(){
            P.say([
                nomangle('Hello there!'),
                nomangle('This code is falling apart!'),
                nomangle('Let\'s fix the glitches before it\'s too late!')
            ]);
        }, 2000);
        tUnlock = 9000;
    }

    T(function(){
        spawnSound.play();
    }, 500);

    T(function(){
        P.talking = false;
        P.controllable = true;
        G.hideTiles = false;
    }, tUnlock);
}
