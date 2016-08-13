function Game(){
    var glitchStart,
        glitchEnd,
        glitchReset,
        nextGlitch = 0,
        glitchTimeleft = 0,

        currentLevel = 0;

    this.globalPattern = null;
    this.t = 0;

    V = new Camera();

    this.startNewWorld = function(){
        // World
        W = new World(generateWorld(currentLevel++));

        // Player
        P = new Character();
        P.x = W.spawn.x + TILE_SIZE / 2;
        P.y = W.spawn.y + TILE_SIZE - CHARACTER_WIDTH / 2;

        // Prevent camera from lagging behind
        V.forceCenter();

        this.applyGlitch();

        // Enemies
        W.detectPaths(ENEMY_PATH_MIN_LENGTH).forEach(function(path){
            if(rand() < ENEMY_DENSITY){
                var enemy = new Enemy(path);
                enemy.x = TILE_SIZE * rand(path.colLeft, path.colRight);
                enemy.y = TILE_SIZE * (path.row + 1) - CHARACTER_HEIGHT / 2;
                W.enemies.push(enemy);
            }
        });
    };

    // Game loop
    this.cycle = function(e){
        this.t += e;

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

        // Cycles
        P.cycle(e);
        V.cycle(e);
        interpCycle(e);

        for(var i in W.enemies){
            W.enemies[i].cycle(e);
        }

        // Rendering
        renderWorld();

        glitchEnd && glitchEnd();
    };

    this.applyGlitch = function(){
        pick([function(){
            glitchEnd = sliceGlitch;
        }, function(){
            glitchEnd = noiseGlitch;
        }, function(){
            glitchStart = matrixGlitch;
            glitchEnd = matrixGlitchReset;
        }, function(){
            glitchStart = invertGlich;
            glitchReset = invertGlitchReset;
        }, function(){
            offsetGlitchEnable();
            glitchReset = offsetGlitchReset;
        }])();

        glitchTimeleft = rand(0.1, 0.3);
        nextGlitch = rand(2, 4);
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
}
