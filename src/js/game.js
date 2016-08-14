function Game(){
    G = this;

    var glitchStart,
        glitchEnd,
        glitchReset,
        nextGlitch = 0,
        glitchTimeleft = 0,
        bugReports = 1;

    this.currentLevel = 0;

    this.t = 0;

    V = new Camera();

    this.startNewWorld = function(){
        // World
        W = new World(generateWorld(++this.currentLevel));

        bugReports = ~~(this.currentLevel * this.currentLevel * 1.4);

        // Player
        P = new Character();
        P.x = W.spawn.x + TILE_SIZE / 2;
        P.y = W.spawn.y + TILE_SIZE - CHARACTER_WIDTH / 2;

        W.cyclables.push(P);
        W.cyclables.push(V);
        W.renderables.push(P);
        W.killables.push(P);

        // Prevent camera from lagging behind
        V.forceCenter();

        //this.applyGlitch();

        // Enemies
        if(this.currentLevel > 3){
            W.detectPaths(ENEMY_PATH_MIN_LENGTH).forEach(function(path){
                if(rand() < ENEMY_DENSITY){
                    var enemy = new Enemy();
                    enemy.x = TILE_SIZE * rand(path.colLeft, path.colRight);
                    enemy.y = TILE_SIZE * (path.row + 1) - CHARACTER_HEIGHT / 2;
                    W.cyclables.push(enemy);
                    W.renderables.push(enemy);
                    W.killables.push(enemy);
                }
            });

            W.detectPaths(1).forEach(function(path){
                if(rand() < GRENADE_DENSITY){
                    var g = new GrenadeItem(
                        (~~rand(path.colLeft, path.colRight) + 0.5) * TILE_SIZE,
                        (path.row + 0.5) * TILE_SIZE
                    );
                    W.renderables.push(g);
                    W.cyclables.push(g);
                }
            });

            setTimeout(function(){
                P.say(pick([
                    'There\'s more?!',
                    'Yay more bugs',
                    'Okay one more bug...'
                ]));
            }, 500);
        }

        if(this.currentLevel == 1){
            setTimeout(function(){
                P.say('Hello there!');
            }, 500);
            setTimeout(function(){
                P.say('Ready to dive in the code?');
            }, 3000);
            setTimeout(function(){
                P.say('Let\'s find the bugs and fix them!');
            }, 6000);
        }

        if(this.currentLevel == 2){
            setTimeout(function(){
                P.say('Wait what?');
            }, 500);
            setTimeout(function(){
                P.say('Seems like we created more bugs');
            }, 3000);
            setTimeout(function(){
                P.say('Let\'s dig a little deeper...');
            }, 6000);
        }

        if(this.currentLevel == 3){
            // Put the enemies at the right spots
            var enemy = new Enemy();
            enemy.x = TILE_SIZE * 11;
            enemy.y = TILE_SIZE * 5 - CHARACTER_HEIGHT / 2;
            W.cyclables.push(enemy);
            W.killables.push(enemy);
            W.renderables.push(enemy);

            var enemy = new Enemy();
            enemy.x = TILE_SIZE * 21;
            enemy.y = TILE_SIZE * 7 - CHARACTER_HEIGHT / 2;
            W.cyclables.push(enemy);
            W.killables.push(enemy);
            W.renderables.push(enemy);

            setTimeout(function(){
                P.say('Watch out for the pointers!');
            }, 3000);
            setTimeout(function(){
                P.say('They\'re super dangerous!');
            }, 6000);
            setTimeout(function(){
                P.say('Either avoid them or kill them');
            }, 9000);
        }
    };

    // Game loop
    this.cycle = function(e){
        this.t += e;

        R.textAlign = 'center';

        var maxDelta = 1 / 120; // TODO adjust

        glitchTimeleft -= e;
        if(glitchTimeleft <= 0){
            glitchReset && glitchReset();
            glitchEnd = null;
            glitchStart = null;

            nextGlitch -= e;
            if(nextGlitch <= 0){
                this.applyGlitch();
            }
        }

        glitchStart && glitchStart();

        var deltas = ~~(e / maxDelta);
        for(var i = 0 ; i < deltas ; i++, e -= maxDelta){
            this.doCycle(maxDelta);
        }

        if(e > 0){
            this.doCycle(e % maxDelta);
        }

        // Rendering
        renderWorld();

        R.font = '20pt Courier New';
        R.textAlign = 'left';

        fillText('Bugs fixed    / ' + (G.currentLevel - 1), 15, 30);
        fillText('Bugs reports  / ' + bugReports, 15, 60);
        fillText('Breakpoints   / ' + P.grenades, 15, 90);

        glitchEnd && glitchEnd();
    };

    this.doCycle = function(e){
        // Cycles
        for(var i in W.cyclables){
            W.cyclables[i].cycle(e);
        }
    };

    this.applyGlitch = function(){
        pick([function(){
            glitchEnd = sliceGlitch;
        }, function(){
            glitchEnd = noiseGlitch;
        }/*, function(){
            glitchStart = matrixGlitch;
            glitchEnd = matrixGlitchReset;
        }*/, function(){
            glitchStart = invertGlich;
            glitchReset = invertGlitchReset;
        }, function(){
            offsetGlitchEnable();
            glitchReset = offsetGlitchReset;
        }])();

        glitchTimeleft = rand(0.1, 0.3);
        nextGlitch = this.currentLevel > 1 ? rand(2, 4) : 99;
    };

    var lf = Date.now();
    T(function(){
        var n = Date.now();

        var e = (n - lf) / 1000;
        lf = n;

        G.cycle(e);

        raf(arguments.callee);
    }, 0);

    this.startNewWorld();
    this.applyGlitch();
}
