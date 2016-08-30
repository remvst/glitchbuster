function Game(){
    G = this;

    var glitchEnd,
        nextGlitch = 0,
        glitchTimeleft = 0;

    G.currentLevel = 0;
    G.resolution = 1;

    G.t = 0;
    G.frameCount = 0;
    G.frameCountStart = Date.now();

    V = new Camera();
    P = new Player();
    P.controllable = false;

    G.newGame = function(tutorial){
        P = new Player();

        G.currentLevel = tutorial ? -1 : 0;
        G.totalTime = 0;
        G.startNewWorld();
        interp(G.menu, 'alpha', 1, 0, 0.5, 0, 0, function(){
            G.menu = null;
        });

        G.renderables.push(new SpawnAnimation(P.x, P.y));
    };

    G.startNewWorld = function(dummy){
        G.cyclables = [];
        G.killables = [];
        G.renderables = [];

        G.applyGlitch(0, 0.5);

        if(dummy){
            return;
        }

        G.timeLeft = 60;

        // World
        W = new World(generateWorld(++G.currentLevel));

        G.hideTiles = false;


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

        // Enemies
        if(!G.currentLevel){
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

                        P.say([
                            nomangle('Watch out for the pointers!'),
                            nomangle('They\'re super dangerous!'),
                            nomangle('Either avoid them or kill them')
                        ]);
                    }
                }
            });
        }else{
            T(function(){
                P.say(pick([
                    nomangle('There\'s more?!'),
                    nomangle('Yay more bugs'),
                    nomangle('Okay one more bug...')
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
    G.cycle = function(e){
        G.t += e;
        G.frameCount++;

        if(G.frameCount == 100){
            var totalTime = Date.now() - G.frameCountStart,
                fps = G.frameCount / (totalTime / 1000);
            if(fps < 30 && !navigator.userAgent.match(/Android/i)){
                G.setResolution(G.resolution * 0.6);
            }
        }

        R.textAlign = 'center';

        var maxDelta = 1 / 120; // TODO adjust

        glitchTimeleft -= e;
        if(glitchTimeleft <= 0){
            glitchEnd = null;

            nextGlitch -= e;
            if(nextGlitch <= 0){
                G.applyGlitch(G.menu ? 0 : NaN);
            }
        }

        var deltas = ~~(e / maxDelta);
        for(var i = 0 ; i < deltas ; i++, e -= maxDelta){
            G.doCycle(maxDelta);
        }

        if(e > 0){
            G.doCycle(e % maxDelta);
        }

        // Rendering
        save();
        scale(G.resolution, G.resolution);

        if(W){
            W.render();
        }

        if(G.menu){
            G.menu.render();
        }else{
            // HUD

            // Health string
            var h = nomangle('mental health: ');
            for(i = 0 ; i < P.health ; i++){
                h += '!';
            }

            // Progress string
            var p = nomangle('progress: ');
            for(i = 0 ; i < 13 ; i++){
                p += (i < G.currentLevel) ? '?' : '-';
            }

            drawCachedText(R, nomangle('progress: ') + progressString('?', G.currentLevel, 13), 10, 10, 4, '#fff');
            drawText(R, nomangle('time left: ') + formatTime(G.timeLeft), 10, 40, 4, G.timeLeft < 15 ? '#f00' : '#fff');

            drawCachedText(R, h, 10, 70, 4, P.health < 3 || P.recoveryTime > 1.8 ? '#f00' : '#fff');
            drawCachedText(R, nomangle('breakpoints: ') + P.grenades, 10, 100, 4, '#fff');

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

        if(glitchEnd){
            glitchEnd();
        }

        if(DEBUG){
            R.fillStyle = '#000';
            fillRect(CANVAS_WIDTH * 0.6, 0, CANVAS_WIDTH * 0.4, 120);

            R.fillStyle = 'white';
            R.textAlign = 'left';
            R.textBaseline = 'middle';
            R.font = '18pt Courier New';
            fillText('FPS: ' + G.fps, CANVAS_WIDTH * 0.6, 20);
            fillText('Cyclables: ' + G.cyclables.length, CANVAS_WIDTH * 0.6, 40);
            fillText('Renderables: ' + G.renderables.length, CANVAS_WIDTH * 0.6, 60);
            fillText('Killables: ' + G.killables.length, CANVAS_WIDTH * 0.6, 80);
            fillText('Resolution: ' + G.resolution, CANVAS_WIDTH * 0.6, 100);
        }

        restore();
    };

    G.doCycle = function(e){
        // Cycles
        for(var i in G.cyclables){
            G.cyclables[i].cycle(e);
        }

        if(!G.menu && P.controllable){
            if((G.timeLeft -= e) <= 0){
                G.timeLeft = 0;
                G.menu = new GameOverMenu(GAME_OVER_TIME);
                interp(G.menu, 'alpha', 0, 1, 0.5);
            }

            if(G.currentLevel > 0){
                // Not counting the tutorial time because it's skippable anyway
                G.totalTime += e;
            }
        }
    };

    G.applyGlitch = function(id, d){
        var l = [function(){
            glitchEnd = shittyMode || shittyMode === undefined ? noiseGlitch : sliceGlitch;
        }, function(){
            glitchEnd = noiseGlitch;
        }];

        (isNaN(id) ? pick(l) : l[id])();

        glitchTimeleft = d || rand(0.1, 0.3);
        nextGlitch = G.currentLevel > 2 ? rand(4, 8) : 99;
        if(G.menu){
            nextGlitch = 2;
        }
    };

    G.playerDied = function(){
        T(function(){
            G.menu = new GameOverMenu(GAME_OVER_DEATH);
            interp(G.menu, 'alpha', 0, 1, 0.5);
        }, 2000);
    };

    G.bugFixed = function(){
        if(G.currentLevel == 13){
            G.menu = new GameOverMenu(GAME_OVER_SUCCESS);
            interp(G.menu, 'alpha', 0, 1, 0.5);
        }else{
            G.applyGlitch(0, 0.5);
            hideTilesAnimation();
            setTimeout(function(){
                G.startNewWorld();
                G.hideTiles = true;
                setTimeout(showTilesAnimation, 500);
            }, 500);
        }
    };

    G.mainMenu = function(){
        G.menu = new MainMenu();
    };

    G.setResolution = function(r){
        G.resolution = r;
        C.width = CANVAS_WIDTH  * r;
        C.height = CANVAS_HEIGHT * r;
    };

    var lf = Date.now();
    T(function(){
        var n = Date.now();

        var e = (n - lf) / 1000;

        if(DEBUG){
            G.fps = ~~(1 / e);
        }

        lf = n;

        G.cycle(e);

        raf(arguments.callee);
    }, 0);

    var displayablePixels = w.innerWidth * w.innerHeight * w.devicePixelRatio,
        gamePixels = CANVAS_WIDTH / CANVAS_HEIGHT,
        ratio = displayablePixels / gamePixels;
    if(ratio < 0.5){
        G.setResolution(ratio * 2);
    }

    G.startNewWorld(true);
    G.menu = new ModeMenu();

    glitchTimeleft = 0;
    nextGlitch = 1;
}
