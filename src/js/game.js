function Game(){
    G = this;

    var glitchStart,
        glitchEnd,
        glitchReset,
        nextGlitch = 0,
        glitchTimeleft = 0;

    this.currentLevel = 0;

    this.t = 0;

    V = new Camera();
    P = new Player();

    this.newGame = function(tutorial){
        P = new Player();

        this.currentLevel = tutorial ? 0 : 1;
        this.startNewWorld();
        interp(this.menu, 'alpha', 1, 0, 0.5, 0, 0, function(){
            G.menu = null;
        });

        G.renderables.push(new SpawnAnimation(P.x, P.y));
    };

    this.startNewWorld = function(dummy){
        this.hideTiles = false;

        this.cyclables = [];
        this.killables = [];
        this.renderables = [];

        // World
        W = new World(generateWorld(++this.currentLevel));

        // Player
        P.x = W.spawn.x + TILE_SIZE / 2;
        P.y = W.spawn.y + TILE_SIZE - CHARACTER_WIDTH / 2;
        P.controllable = true;
        P.fixing = false;

        G.cyclables.push(P);
        G.cyclables.push(V);
        G.renderables.push(P);
        G.killables.push(P);

        // Prevent camera from lagging behind
        V.forceCenter();

        this.applyGlitch(0, 0.5);

        if(dummy){
            return;
        }

        // Enemies
        if(this.currentLevel == 1){
            setTimeout(function(){
                P.say(string('Hello there!'));
            }, 500);
            setTimeout(function(){
                P.say(string('Ready to dive in the code?'));
            }, 3000);
            setTimeout(function(){
                P.say(string('Let\'s find the bugs and fix them!'));
            }, 6000);

            // Put the enemies at the right spots
            var enemy1 = new WalkingEnemy();
            enemy1.x = 4900;
            enemy1.y = 500;
            G.cyclables.push(enemy1);
            G.killables.push(enemy1);
            G.renderables.push(enemy1);

            var enemy2 = new JumpingEnemy();
            enemy2.x = 6500;
            enemy2.y = 500;
            G.cyclables.push(enemy2);
            G.killables.push(enemy2);
            G.renderables.push(enemy2);

            var metEnemy;
            G.cyclables.push({
                cycle: function(){
                    if(!metEnemy && abs(P.x - enemy1.x) < CANVAS_WIDTH){
                        metEnemy = true;

                        P.say(string('Watch out for the pointers!'));
                        setTimeout(function(){
                            P.say(string('They\'re super dangerous!'));
                        }, 3000);
                        setTimeout(function(){
                            P.say(string('Either avoid them or kill them'));
                        }, 6000);
                    }
                }
            });
        }else{
            setTimeout(function(){
                P.say(pick([
                    string('There\'s more?!'),
                    string('Yay more bugs'),
                    string('Okay one more bug...')
                ]));
            }, 500);

            // Add enemies
            W.detectPaths(ENEMY_PATH_MIN_LENGTH).forEach(function(path){
                if(rand() < ENEMY_DENSITY){
                    var enemy = new (pick([WalkingEnemy, JumpingEnemy]))();
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
        W.render();

        if(this.menu){
            this.menu.render();
        }else{
            // HUD
            R.font = '20pt Courier New';
            R.textAlign = 'left';

            var health = '';
            for(var i = 0 ; i < P.health ; i++){
                health += '!';
            }

            drawText(R, string('mental health: ') + health, 10, 10, 4, '#fff');
            drawText(R, string('breakpoints: ') + P.grenades, 10, 40, 4, '#fff');

            if(G.touch){
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
        }*//*, function(){
            glitchStart = invertGlich;
            glitchReset = invertGlitchReset;
        }*/, function(){
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

    this.playerDied = function(){
        setTimeout(function(){
            G.menu = new GameOverMenu();
            interp(G.menu, 'alpha', 0, 1, 0.5);
        }, 2000);
    };

    this.mainMenu = function(){
        this.menu = new MainMenu();
    };

    var lf = Date.now();
    T(function(){
        var n = Date.now();

        var e = (n - lf) / 1000;
        lf = n;

        G.cycle(e);

        raf(arguments.callee);
    }, 0);

    this.startNewWorld(true);
    this.mainMenu();

    glitchTimeleft = 0;
    nextGlitch = 1;
}
