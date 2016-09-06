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

    interp(this, 'radius', 320, 0, 0.4, 1);
    interp(this, 'alpha', 0, 1, 0.4, 1, null, function(){
        P.visible = true;

        for(var i = 0 ; i < 50 ; i++){
            var t = rand(0.5, 1.5),
                a = rand(-PI, PI),
                l = rand(8, 80),
                x = cos(a) * l + P.x,
                y = sin(a) * l + P.y - 40;

            particle(4, '#fff', [
                ['x', x, x, t, 0, oscillate],
                ['y', y, y + rand(80, 240), t, 0],
                ['s', rand(8, 16), 0, t]
            ], true);
        }
    });

    P.visible = P.controllable = false;
    P.talking = true;
    G.hideTiles = true;

    var tUnlock = 500;
    if(!G.currentLevel){
        delayed(function(){
            P.say([
                nomangle('Hello there!'),
                nomangle('This code is falling apart!'),
                nomangle('Let\'s fix the glitches before it\'s too late!')
            ]);
        }, 2000);
        tUnlock = 9000;
    }

    delayed(function(){
        spawnSound.play();
    }, 500);

    delayed(function(){
        P.talking = false;
        P.controllable = true;
        showTilesAnimation();
    }, tUnlock);
}
