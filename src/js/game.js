function Game(){
    G = this;

    var glitchEnd,
        nextGlitch = 0,
        glitchTimeleft = 0;

    G.currentLevel = 0;
    G.resolution = 1;

    G.t = 0;
    //G.frameCount = 0;
    //G.frameCountStart = Date.now();

    V = new Camera();
    P = new Player();
    P.controllable = false;

    G.tutorial = function(){
        G.newGame(true);
    };

    G.newGame = function(tutorial){
        P = new Player();

        G.currentLevel = tutorial ? -1 : 0;
        G.totalTime = 0;
        G.startNewWorld();
        interp(G.menu, 'alpha', 1, 0, 0.5, 0, 0, function(){
            G.menu = null;
        });

        G.add(new SpawnAnimation(P.x, P.y), RENDERABLE);
    };

    G.startNewWorld = function(dummy){
        G.cyclables = [];
        G.killables = [];
        G.renderables = [];
        G.timeLeft = TIME_PER_LEVEL;

        G.applyGlitch(0, 0.5);

        if(dummy){
            return;
        }

        // World
        W = new World(generateWorld(++G.currentLevel));

        // Keeping track of the items we can spawn
        W.itemsAllowed = {
            HEALTH: PLAYER_MAX_HEALTH - P.health, // max 6 health
            GRENADE: 10 - P.grenades // max 5 nades
        };

        G.hideTiles = false;

        // Player
        P.x = W.spawn.x + TILE_SIZE / 2;
        P.y = W.spawn.y + TILE_SIZE - CHARACTER_WIDTH / 2;
        P.controllable = true;
        P.fixing = false;

        G.add(V, CYCLABLE);
        G.add(P, evaluate(CYCLABLE | RENDERABLE | KILLABLE));

        // Prevent camera from lagging behind
        V.forceCenter();

        // Enemies
        if(!G.currentLevel){
            // Put the enemies at the right spots
            var e1;

            G.add(e1 = new WalkingEnemy(4500, 800), evaluate(CYCLABLE | RENDERABLE | KILLABLE));
            G.add(new JumpingEnemy(5700, 800), evaluate(CYCLABLE | RENDERABLE | KILLABLE));

            var metEnemy;
            G.add({
                cycle: function(){
                    if(!metEnemy && abs(P.x - e1.x) < CANVAS_WIDTH){
                        metEnemy = true;

                        P.say([
                            nomangle('Watch out for the pointers!'),
                            nomangle('They\'re super dangerous!'),
                            nomangle('Either avoid them or kill them')
                        ]);
                    }
                }
            }, CYCLABLE);
        }else{
            delayed(function(){
                P.say(pick([
                    nomangle('There\'s more?!'),
                    nomangle('Yay more bugs'),
                    nomangle('Okay one more bug...')
                ]));
            }, 500);

            // Add enemies
            W.detectPaths(ENEMY_PATH_MIN_LENGTH).forEach(function(path){
                var enemy = new (pick([WalkingEnemy, JumpingEnemy]))(
                    TILE_SIZE * rand(path.colLeft, path.colRight),
                    TILE_SIZE * (path.row + 1) - CHARACTER_HEIGHT / 2
                );
                if(rand() < ENEMY_DENSITY && dist(enemy, P) > CANVAS_WIDTH / 2){
                    G.add(enemy, evaluate(CYCLABLE | RENDERABLE | KILLABLE));
                }
            });

            // Add items for pickup
            var itemPaths = W.detectPaths(1);
            pick(itemPaths, itemPaths.length).forEach(function(path){
                // Create the item and place it on the path
                G.droppable(
                    (~~rand(path.colLeft, path.colRight) + 0.5) * TILE_SIZE,
                    (path.row + 0.5) * TILE_SIZE,
                    ITEM_DENSITY
                );
            });
        }
    };

    // Game loop
    G.cycle = function(e){
        G.t += e;

        /*// 100th frame, checking if we are in a bad situation, and if yes, enable shitty mode
        if(++G.frameCount == 100 && (G.frameCount / ((Date.now() - G.frameCountStart) / 1000) < 30)){
            G.setResolution(G.resolution * 0.5);
            shittyMode = true;
        }*/

        glitchTimeleft -= e;
        if(glitchTimeleft <= 0){
            glitchEnd = null;

            nextGlitch -= e;
            if(nextGlitch <= 0){
                G.applyGlitch();
            }
        }

        var maxDelta = 1 / 120, // TODO adjust
            deltas = ~~(e / maxDelta);
        while(e > 0){
            G.doCycle(min(e, maxDelta));
            e -= maxDelta;
        }

        // Rendering
        save();
        scale(G.resolution, G.resolution);

        // Font settings are common across the game
        R.textAlign = nomangle('center');
        R.textBaseline = nomangle('middle');

        if(W){
            W.render();
        }

        if(G.menu){
            G.menu.render();
        }else{
            // HUD

            // Health string
            var healthString = '';
            for(i = 0 ; i < P.health ; i++){
                healthString += '!';
            }

            // Timer string
            var timerString = formatTime(G.timeLeft, true),
                progressString = nomangle('progress: ') + G.currentLevel + '/13',
                grenadesString = nomangle('breakpoints: ') + P.grenades;

            drawText(R, timerString, (CANVAS_WIDTH - requiredCells(timerString) * 10) / 2, mobile ? 50 : 10, 10, G.timeLeft > 30 ? '#fff' : '#f00');
            drawCachedText(R, healthString, (CANVAS_WIDTH - requiredCells(healthString) * 5) / 2, mobile ? 120 : 80, 5, P.health < 3 || P.recoveryTime > 1.8 ? '#f00' : '#fff');

            drawCachedText(R, progressString, (CANVAS_WIDTH - requiredCells(progressString) * 4) - 10, 10, 4, '#fff');
            drawCachedText(R, grenadesString, 10, 10, 4, '#fff');

            if(G.touch){
                // Mobile controls
                [leftArrow, rightArrow, grenadeButton, jumpArrow].forEach(function(b, i){
                    R.globalAlpha = touchButtons[i] ? 1 : 0.5;
                    drawImage(b, (i + 0.5) * CANVAS_WIDTH / 4 - MOBILE_BUTTON_SIZE / 2, CANVAS_HEIGHT - 100);
                });

                R.globalAlpha = 1;
            }
        }

        if(DEBUG){
            save();

            R.fillStyle = '#000';
            fillRect(CANVAS_WIDTH * 0.6, 0, CANVAS_WIDTH * 0.4, 120);

            R.fillStyle = 'white';
            R.textAlign = 'left';
            R.font = '18pt Courier New';
            fillText('FPS: ' + G.fps, CANVAS_WIDTH * 0.6, 20);
            fillText('Cyclables: ' + G.cyclables.length, CANVAS_WIDTH * 0.6, 40);
            fillText('Renderables: ' + G.renderables.length, CANVAS_WIDTH * 0.6, 60);
            fillText('Killables: ' + G.killables.length, CANVAS_WIDTH * 0.6, 80);
            fillText('Resolution: ' + G.resolution, CANVAS_WIDTH * 0.6, 100);

            restore();
        }

        restore();

        if(glitchEnd){
            glitchEnd();
        }
    };

    G.doCycle = function(e){
        // Cycles
        for(var i = G.cyclables.length ; --i >= 0 ;){
            G.cyclables[i].cycle(e);
        }

        if(!G.menu && P.controllable){
            if((G.timeLeft -= e) <= 0){
                G.timeLeft = 0;
                G.menu = new GameOverMenu(GAME_OVER_TIME);
                interp(G.menu, 'alpha', 0, 1, 0.5);
            }

            if(G.currentLevel){
                // Not counting the tutorial time because it's skippable anyway
                G.totalTime += e;
            }
        }
    };

    G.applyGlitch = function(id, t){
        var l = [function(){
            glitchEnd = noiseGlitch;
        }];

        if(!G.menu && !shittyMode){
            l.push(function(){
                glitchEnd = sliceGlitch;
            });
        }

        if(isNaN(id)){
            pick(l)();
        }else{
            l[id]();
        }

        glitchTimeleft = t || rand(0.1, 0.3);
        nextGlitch = G.currentLevel ? rand(4, 8) : 99;
    };

    G.playerDied = function(){
        delayed(function(){
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
            delayed(function(){
                G.startNewWorld();
                G.hideTiles = true;
                delayed(showTilesAnimation, 500);
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

    G.add = function(e, type){
        if(type & RENDERABLE){
            G.renderables.push(e);
        }
        if(type & CYCLABLE){
            G.cyclables.push(e);
        }
        if(type & KILLABLE){
            G.killables.push(e);
        }
    };

    G.remove = function(e){
        remove(G.cyclables, e);
        remove(G.killables, e);
        remove(G.renderables, e);
    };

    G.droppable = function(x, y, probability, particles){
        if(rand() < probability){
            var item = new (pick([GrenadeItem, HealthItem]))(x, y);
            if(--W.itemsAllowed[item.type] > 0){
                G.add(item, evaluate(CYCLABLE | RENDERABLE));
                if(particles){
                    item.particles();
                }
            }
        }
    };

    /*var displayablePixels = w.innerWidth * w.innerHeight * w.devicePixelRatio,
        gamePixels = CANVAS_WIDTH / CANVAS_HEIGHT,
        ratio = displayablePixels / gamePixels;
    if(ratio < 0.5){
        G.setResolution(ratio * 2);
    }*/

    G.startNewWorld(true);

    G.menu = new (mobile ? ModeMenu : MainMenu)();
    if(!mobile){
        shittyMode = false;
    }

    glitchTimeleft = 0;
    nextGlitch = 1;

    var lf = Date.now();
    (function(){
        var n = Date.now(),
            e = (n - lf) / 1000;

        if(DEBUG){
            G.fps = ~~(1 / e);
        }

        lf = n;

        G.cycle(e);

        (requestAnimationFrame || webkitRequestAnimationFrame || mozRequestAnimationFrame)(arguments.callee);
    })();
}
