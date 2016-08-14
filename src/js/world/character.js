function Character(){
    this.x = this.y = 0;
    this.direction = 0;
    this.facing = 1;
    //this.fixing = false;
    this.controllable = true;

    this.bodyOffsetY = 0;
    this.bodyColor = '#fff';
    this.legColor = '#aaa';
    this.halo = whiteHalo;
    this.bubbleTailLength = 0;

    this.scaleFactor = 1;

    this.vX = 0;
    this.vY = 0;

    var jumpCount = 0,
        previousFloorY;

    this.render = function(){
        save();
        translate(this.x, this.y);

        // Halo
        drawImage(this.halo, -HALO_SIZE_HALF, -HALO_SIZE_HALF);

        // Dialog
        if(this.sayingTimeleft > 0){
            R.font = '20pt Arial';

            var w = measureText(this.saying).width + 10;
            R.fillStyle = '#000';
            R.globalAlpha = 0.5;
            fillRect(-w / 2, -85 - this.bubbleTailLength, w, 30);
            R.globalAlpha = 1;

            R.fillStyle = '#fff';
            fillRect(-2, -50, 4, -this.bubbleTailLength);

            R.font = '20pt Arial';
            fillText(this.saying, 0, -70 - this.bubbleTailLength);
            //strokeText(this.saying, 2, -68 - this.bubbleTailLength);
        }

        // Facing left or right
        scale(this.facing * this.scaleFactor, 1);

        // Legs
        if(!this.dead){
            save();
            translate(-CHARACTER_WIDTH / 2 + 2, -CHARACTER_HEIGHT / 2);

            var legAmplitude = 10,
                legPeriod = 0.3,
                legLength = (sin((G.t * PI * 2) / legPeriod) / 2) * legAmplitude + legAmplitude / 2;

            var leftLegLength = this.direction || jumpCount > 0 ? legLength : legAmplitude;
            var rightLegLength = this.direction || jumpCount > 0 ? legAmplitude - legLength : legAmplitude;

            R.fillStyle = this.legColor;
            fillRect(12, 56, 8, leftLegLength);
            fillRect(44, 56, 8, rightLegLength);
            restore();
        }

        // Let's bob a little
        var bodyRotationMaxAngle = PI / 16,
            bodyRotationPeriod = 0.5,
            bodyRotation = (sin((G.t * PI * 2) / bodyRotationPeriod) / 2) * bodyRotationMaxAngle;

        if(this.bodyRotation){
            bodyRotation = this.bodyRotation;
        }else if(!this.direction && !this.fixing){
            bodyRotation = 0;
        }

        translate(0, this.bodyOffsetY);
        rotate(bodyRotation);

        // Body
        save();
        translate(-CHARACTER_WIDTH / 2 + 2, -CHARACTER_HEIGHT / 2);
        R.fillStyle = this.bodyColor;
        fillRect(0, 0, 58, 56);

        // Eyes
        var p = 4, // blink interval
            bt = 0.3, // blink time
            mt = G.t % p, // modulo-ed time
            mi = p - bt / 2, // middle of the blink
            s = min(1, max(-mt + mi, mt - mi) / (bt / 2)), // scale of the eyes
            h = s * 6;

        if(this.dead){
            h = 1;
        }

        if(!this.fixing){
            R.fillStyle = '#000';
            fillRect(34, 12, 6, h);
            fillRect(46, 12, 6, h);
        }
        restore();

        restore();
    };

    this.cycle = function(e){
        var before = {
            x: this.x,
            y: this.y
        };

        this.sayingTimeleft -= e;

        // Movement

        // Friction
        var frictionFactor = (this.vY ? 3 : 4) * PLAYER_SPEED,
            targetSpeed = this.direction * PLAYER_SPEED,
            diff = targetSpeed - this.vX,
            appliedDiff = between(-frictionFactor * e, diff, frictionFactor * e);

        this.vX = between(-PLAYER_SPEED, this.vX + appliedDiff, PLAYER_SPEED);

        if(this.controllable){
            this.x += this.vX * e;

            if(this.direction == -this.facing){
                interp(this, 'scaleFactor', -1, 1, 0.1);
            }

            this.facing = this.direction || this.facing;
        }

        // Vertical movement
        this.vY += e * GRAVITY;
        this.y += this.vY * e;

        // Collisions
        var adjustments = this.readjust(before);

        // If there has been no adjustment for up or down, it means we're in the air
        if(!(adjustments & DOWN) && !(adjustments & UP)){
            jumpCount = max(1, jumpCount);
        }

        // Exit detection
        var d = dist(this, W.exit.center);
        if(this.controllable){
            if(d < TILE_SIZE / 2){
                this.controllable = false;
                this.fixing = true;

                this.say('Let\'s fix this...');

                interp(this, 'x', this.x, W.exit.center.x, 1);
                interp(W.exit, 'alpha', 1, 0, 2);

                setTimeout(function(){
                    P.say('Done!');
                }, 2000);

                setTimeout(function(){
                    G.startNewWorld();
                }, 3000);
            }else if(d < CANVAS_WIDTH * 0.5 && !this.found){
                this.found = true;
                this.say('You found the bug!'); // TODO more strings
            }
        }
    };

    this.jump = function(p, f){
        if(f){
            jumpCount = 0;
        }

        if(jumpCount++ <= 1 && this.controllable){
            this.vY = p * PLAYER_JUMP_ACCELERATION;
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

    this.landOn = function(tiles){
        this.vY = 0;
        jumpCount = 0;

        // Find the tile that was the least dangerous
        // We assume types are sorted from non lethal to most lethal
        var tile = tiles.sort(function(a, b){
            return abs(a.center.x - P.x) - abs(b.center.x - P.x);
        })[0];

        tile.landed(this);

        if(tile.y === previousFloorY){
            return;
        }

        if(!this.dead){
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
        }

        previousFloorY = tile.y;
    };

    this.tapOn = function(tiles){
        this.vY = 0; // prevent from pushing that tile

        // Find the tile that was the least dangerous
        // We assume types are sorted from non lethal to most lethal
        var tile = tiles.sort(function(a, b){
            return abs(a.center.x - P.x) - abs(b.center.x - P.x);
        })[0];

        tile.tapped(this);
    };

    this.readjust = function(before){
        var leftX = this.x - CHARACTER_WIDTH / 2,
            rightX = this.x + CHARACTER_WIDTH / 2,
            topY = this.y - CHARACTER_HEIGHT / 2,
            bottomY = this.y + CHARACTER_HEIGHT / 2;

        var topLeft = W.tileAt(leftX, topY),
            topRight = W.tileAt(rightX, topY),
            bottomLeft = W.tileAt(leftX, bottomY),
            bottomRight = W.tileAt(rightX, bottomY);

        var t = 0;

        if(topRight && bottomLeft && !bottomRight && !topLeft){
            t |= topRight.pushAway(this);
            t |= bottomLeft.pushAway(this);
        }

        else if(topLeft && bottomRight && !topRight && !bottomLeft){
            t |= topLeft.pushAway(this);
            t |= bottomRight.pushAway(this);
        }

        else if(topLeft && topRight){
            this.y = ceil(topY / TILE_SIZE) * TILE_SIZE + CHARACTER_HEIGHT / 2;
            t |= DOWN;

            if(bottomLeft){
                this.x = ceil(leftX / TILE_SIZE) * TILE_SIZE + CHARACTER_WIDTH / 2;
                t |= RIGHT;
            }else if(bottomRight){
                this.x = floor(rightX / TILE_SIZE) * TILE_SIZE - CHARACTER_WIDTH / 2;
                t |= LEFT;
            }

            this.tapOn([topLeft, topRight]);
        }

        else if(bottomLeft && bottomRight){
            this.y = floor(bottomY / TILE_SIZE) * TILE_SIZE - CHARACTER_HEIGHT / 2;
            t |= UP;

            if(topLeft){
                this.x = ceil(leftX / TILE_SIZE) * TILE_SIZE + CHARACTER_WIDTH / 2;
                t |= RIGHT;
            }else if(topRight){
                this.x = floor(rightX / TILE_SIZE) * TILE_SIZE - CHARACTER_WIDTH / 2;
                t |= LEFT;
            }

            this.landOn([bottomLeft, bottomRight]);
        }

        // Collision against a wall
        else if(topLeft && bottomLeft){
            this.x = ceil(leftX / TILE_SIZE) * TILE_SIZE + CHARACTER_WIDTH / 2;
            t |= RIGHT;
        }

        else if(topRight && bottomRight){
            this.x = floor(rightX / TILE_SIZE) * TILE_SIZE - CHARACTER_WIDTH / 2;
            t |= LEFT;
        }

        // 1 intersection
        else if(bottomLeft){
            t |= bottomLeft.pushAway(this);
        }

        else if(bottomRight){
            t |= bottomRight.pushAway(this);
        }

        else if(topLeft){
            t |= topLeft.pushAway(this);
        }

        else if(topRight){
            t |= topRight.pushAway(this);
        }

        // Based on the adjustment, fire some tile events
        if(t & UP){
            this.landOn([bottomLeft, bottomRight].filter(toBool));
        }else if(t & DOWN){
            this.tapOn([topLeft, topRight].filter(toBool));
        }

        return t;
    };

    this.die = function(){
        // Can't die twice, avoid deaths while fixing bugs
        if(this.dead || this.fixing){
            return;
        }

        this.controllable = false;
        this.dead = true;

        for(var i = 0 ; i < 40 ; i++){
            var x = rand(this.x - CHARACTER_WIDTH / 2, this.x + CHARACTER_WIDTH / 2),
                y = rand(this.y - CHARACTER_HEIGHT / 2, this.y + CHARACTER_HEIGHT / 2),
                d = rand(0.5, 1);
            particle(4, '#900', [
                ['x', x, x, 0.5],
                ['y', y, y - rand(50, 100), 0.5],
                ['s', 15, 0, 0.5]
            ]);
            particle(4, '#900', [
                ['x', x, x, d],
                ['y', y, this.y + CHARACTER_HEIGHT / 2, d, 0, easeOutBounce],
                ['s', 15, 0, d]
            ]);
        }

        this.bodyOffsetY = 10;

        interp(this, 'bodyRotation', 0, -PI / 2, 0.3);

        this.say('...');
    };

    this.say = function(s){
        this.saying = s;
        this.sayingTimeleft = 3;
        interp(this, 'bubbleTailLength', 0, 70, 0.3, 0, easeOutBack);
    };

    this.throwGrenade = function(){
        if(!this.dead){
            var g = new Grenade();
            g.x = this.x;
            g.y = this.y;
            g.throw(-PI / 2 + this.facing * PI / 3, 1000);
            W.cyclables.push(g);
            W.renderables.push(g);
        }
    };
}
