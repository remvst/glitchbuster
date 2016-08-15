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

    this.newGame = function(tutorial){
        this.currentLevel = tutorial ? 0 : 3;
        this.startNewWorld();
        this.menu = null;
    };

    this.startNewWorld = function(){
        this.cyclables = [];
        this.killables = [];
        this.renderables = [];

        // World
        W = new World(generateWorld(++this.currentLevel));

        bugReports = ~~(this.currentLevel * this.currentLevel * 1.4);

        // Player
        P = new Character();
        P.x = W.spawn.x + TILE_SIZE / 2;
        P.y = W.spawn.y + TILE_SIZE - CHARACTER_WIDTH / 2;

        G.cyclables.push(P);
        G.cyclables.push(V);
        G.renderables.push(P);
        G.killables.push(P);

        // Prevent camera from lagging behind
        V.forceCenter();

        this.applyGlitch(0, 0.5);

        // Enemies
        if(this.currentLevel > 3){
            // Add enemies
            W.detectPaths(ENEMY_PATH_MIN_LENGTH).forEach(function(path){
                if(rand() < ENEMY_DENSITY){
                    var enemy = new Enemy();
                    enemy.x = TILE_SIZE * rand(path.colLeft, path.colRight);
                    enemy.y = TILE_SIZE * (path.row + 1) - CHARACTER_HEIGHT / 2;
                    G.cyclables.push(enemy);
                    G.renderables.push(enemy);
                    G.killables.push(enemy);
                }
            });

            // Add grenades for pick up
            W.detectPaths(1).forEach(function(path){
                if(rand() < GRENADE_DENSITY){
                    var g = new GrenadeItem(
                        (~~rand(path.colLeft, path.colRight) + 0.5) * TILE_SIZE,
                        (path.row + 0.5) * TILE_SIZE
                    );
                    G.renderables.push(g);
                    G.cyclables.push(g);
                }
            });
        }

        if(this.currentLevel > 2){
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
            G.cyclables.push(enemy);
            G.killables.push(enemy);
            G.renderables.push(enemy);

            var enemy = new Enemy();
            enemy.x = TILE_SIZE * 21;
            enemy.y = TILE_SIZE * 7 - CHARACTER_HEIGHT / 2;
            G.cyclables.push(enemy);
            G.killables.push(enemy);
            G.renderables.push(enemy);

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
                this.applyGlitch(this.menu ? 0 : NaN);
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


        if(this.menu){
            this.menu.render();
        }else if(G.touch){
            // Mobile controls
            R.globalAlpha = touchButtons[0] ? 1 : 0.5;
            drawImage(leftArrow, CANVAS_WIDTH * 0.5 / 4 - leftArrow.width / 2, CANVAS_HEIGHT - 100);

            R.globalAlpha = touchButtons[1] ? 1 : 0.5;
            drawImage(rightArrow, CANVAS_WIDTH * 1.5 / 4 - rightArrow.width / 2, CANVAS_HEIGHT - 100);

            R.globalAlpha = touchButtons[2] ? 1 : 0.5;
            drawImage(grenadeButton, CANVAS_WIDTH * 2.5 / 4 - grenadeButton.width / 2, CANVAS_HEIGHT - 100);

            R.globalAlpha = touchButtons[3] ? 1 : 0.5;
            drawImage(jumpArrow, CANVAS_WIDTH * 3.5 / 4 - jumpArrow.width / 2, CANVAS_HEIGHT - 100);

            R.globalAlpha = 1;
        }

        glitchEnd && glitchEnd();
    };

    this.doCycle = function(e){
        // Cycles
        for(var i in G.cyclables){
            G.cyclables[i].cycle(e);
        }
    };

    this.applyGlitch = function(id, d){
        var l = [function(){
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
        }];

        (isNaN(id) ? pick(l) : l[id])();

        glitchTimeleft = d || rand(0.1, 0.3);
        nextGlitch = this.currentLevel > 2 ? rand(4, 8) : 99;
        if(this.menu){
            nextGlitch = 2;
        }
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
    this.menu = new MainMenu();

    glitchTimeleft = 0;
    nextGlitch = 1;
}
