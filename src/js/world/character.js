function Character(){
    this.x = this.y = 0;
    this.direction = 0;
    this.facing = 1;
    this.fixing = false;
    this.controllable = true;

    this.bodyOffsetY = 0;
    this.bodyColor = '#fff';
    this.legColor = '#aaa';
    this.halo = whiteHalo;

    this.vY = 0;

    var jumpCount = 0,
        previousFloorY;

    this.render = function(){
        R.save();
        R.translate(this.x, this.y);
        R.scale(this.facing, 1);

        R.drawImage(this.halo, -HALO_SIZE_HALF, -HALO_SIZE_HALF);

        R.translate(-CHARACTER_WIDTH / 2 + 2, -CHARACTER_HEIGHT / 2);

        // Legs
        var legAmplitude = 10,
            legPeriod = 0.3,
            legLength = (sin((G.t * PI * 2) / legPeriod) / 2) * legAmplitude + legAmplitude / 2;

        var leftLegLength = this.direction || jumpCount > 0 ? legLength : legAmplitude;
        var rightLegLength = this.direction || jumpCount > 0 ? legAmplitude - legLength : legAmplitude;

        R.fillStyle = this.legColor;
        R.fillRect(12, 56, 8, leftLegLength);
        R.fillRect(44, 56, 8, rightLegLength);

        // Body
        R.save();
        R.translate(0, this.bodyOffsetY);
        R.fillStyle = this.bodyColor;
        R.fillRect(0, 0, 58, 56);

        // Eyes
        var p = 4, // blink interval
            bt = 0.3, // blink time
            mt = G.t % p, // modulo-ed time
            mi = p - bt / 2, // middle of the blink
            s = min(1, max(-mt + mi, mt - mi) / (bt / 2)), // scale of the eyes
            h = s * 6;

        if(!this.fixing){
            R.fillStyle = '#000';
            R.fillRect(34, 12, 6, h);
            R.fillRect(46, 12, 6, h);
        }
        R.restore();

        R.restore();
    };

    this.cycle = function(e){
        var maxDelta = 1 / 50; // TODO adjust

        var deltas = ~~(e / maxDelta);
        for(var i = 0 ; i < deltas ; i++, e -= maxDelta){
            this.doCycle(maxDelta);
        }

        if(e > 0){
            this.doCycle(e % maxDelta);
        }
    };

    this.doCycle = function(e){
        var before = {
            x: this.x,
            y: this.y
        };

        // Jump acceleration
        this.vY += e * GRAVITY;

        // Movement
        if(this.controllable){
            this.x += this.direction * PLAYER_SPEED * e;
        }

        this.y += this.vY * e;

        this.facing = this.direction || this.facing;

        // Collisions
        var adjustments = this.readjust(before);

        // If there has been no adjustment for up or down, it means we're in the air
        if(!(adjustments & DOWN) && !(adjustments & UP)){
            jumpCount = max(1, jumpCount);
        }

        if(this.controllable && dist(this, W.exit.center) < TILE_SIZE / 2){
            this.controllable = false;
            this.fixing = true;

            interp(this, 'x', this.x, W.exit.center.x, 0.3);

            setTimeout(function(){
                G.startNewWorld();
            }, 2000);
        }
    };

    this.jump = function(){
        if(jumpCount++ <= 1 && this.controllable){
            this.vY = PLAYER_JUMP_ACCELERATION;
            previousFloorY = -1;

            var y = this.y + CHARACTER_HEIGHT / 2;
            for(var i = 0 ; i < 5 ; i++){
                var x = rand(this.x - CHARACTER_WIDTH / 2, this.x + CHARACTER_WIDTH / 2);
                particle(4, '#888', [
                    ['x', x, x, 0.3],
                    ['y', y, y - rand(50, 100), 0.3],
                    ['s', 15, 0, 0.3]
                ]);
            }
        }
    };

    this.landOn = function(tile){
        this.vY = 0;

        jumpCount = 0;

        if(tile.y === previousFloorY){
            return;
        }

        tile.landed(this);

        interp(this, 'bodyOffsetY', 0, 10, 0.1);
        interp(this, 'bodyOffsetY', 10, 0, 0.1, 0.1);

        for(var i = 0 ; i < 5 ; i++){
            var x = rand(this.x - CHARACTER_WIDTH / 2, this.x + CHARACTER_WIDTH / 2);
            particle(4, '#888', [
                ['x', x, x, 0.3],
                ['y', tile.y, tile.y - rand(50, 100), 0.3],
                ['s', 15, 0, 0.3]
            ]);
        }

        previousFloorY = tile.y;
    };

    this.tapOn = function(tile){
        this.vY = 0; // prevent from pushing that tile

        tile.tapped(this);
    };

    this.readjust = function(before){
        var leftX = this.x - CHARACTER_WIDTH / 2;
        var rightX = this.x + CHARACTER_WIDTH / 2;
        var topY = this.y - CHARACTER_HEIGHT / 2;
        var bottomY = this.y + CHARACTER_HEIGHT / 2;

        var topLeft = W.tileAt(leftX, topY);
        var topRight = W.tileAt(rightX, topY);
        var bottomLeft = W.tileAt(leftX, bottomY);
        var bottomRight = W.tileAt(rightX, bottomY);

        var t = 0;

        if(topRight && bottomLeft && !bottomRight && !topLeft){
            t |= topRight.pushAway(this, before);
            t |= bottomLeft.pushAway(this, before);
        }

        else if(topLeft && bottomRight && !topRight && !bottomLeft){
            t |= topLeft.pushAway(this, before);
            t |= bottomRight.pushAway(this, before);
        }

        else if(topLeft && topRight){
            this.y = M.ceil(topY / TILE_SIZE) * TILE_SIZE + CHARACTER_HEIGHT / 2;
            t |= DOWN;

            if(bottomLeft){
                this.x = M.ceil(leftX / TILE_SIZE) * TILE_SIZE + CHARACTER_WIDTH / 2;
                t |= RIGHT;
            }else if(bottomRight){
                this.x = M.floor(rightX / TILE_SIZE) * TILE_SIZE - CHARACTER_WIDTH / 2;
                t |= LEFT;
            }

            this.tapOn(topLeft);
            this.tapOn(topRight);
        }

        else if(bottomLeft && bottomRight){
            this.y = M.floor(bottomY / TILE_SIZE) * TILE_SIZE - CHARACTER_HEIGHT / 2;
            t |= UP;

            if(topLeft){
                this.x = M.ceil(leftX / TILE_SIZE) * TILE_SIZE + CHARACTER_WIDTH / 2;
                t |= RIGHT;
            }else if(topRight){
                this.x = M.floor(rightX / TILE_SIZE) * TILE_SIZE - CHARACTER_WIDTH / 2;
                t |= LEFT;
            }

            this.landOn(bottomLeft);
            this.landOn(bottomRight);
        }

        // Collision against a wall
        else if(topLeft && bottomLeft){
            this.x = M.ceil(leftX / TILE_SIZE) * TILE_SIZE + CHARACTER_WIDTH / 2;
            t |= RIGHT;
        }

        else if(topRight && bottomRight){
            this.x = M.floor(rightX / TILE_SIZE) * TILE_SIZE - CHARACTER_WIDTH / 2;
            t |= LEFT;
        }

        // 1 intersection
        else if(bottomLeft){
            t |= bottomLeft.pushAway(this, before);
        }

        else if(bottomRight){
            t |= bottomRight.pushAway(this, before);
        }

        else if(topLeft){
            t |= topLeft.pushAway(this, before);
        }

        else if(topRight){
            t |= topRight.pushAway(this, before);
        }

        // Based on the adjustment, fire some tile events
        if(t & UP){
            this.landOn(bottomLeft || bottomRight);
        }else if(t & DOWN){
            this.tapOn(topLeft || topRight);
        }

        return t;
    };
}
