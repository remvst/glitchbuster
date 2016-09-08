function Character(){
    this.x = this.y = 0;
    this.direction = 0;
    this.facing = 1;

    this.visible = true;

    this.offsetY = 0;
    this.bodyOffsetY = 0;
    this.bubbleTailLength = 0;
    this.saying = [];
    this.sayingTimeleft = 0;

    this.scaleFactorX = 1;
    this.scaleFactorY = 1;
    this.recoveryTime = 0;
    this.frictionFactor = 4;

    this.vX = 0;
    this.vY = 0;

    this.lastAdjustment = 0;

    var jumpCount = 0,
        previousFloorY;

    this.render = function(){
        if(this.recoveryTime > 0 && ~~((this.recoveryTime * 2 * 4) % 2) && !this.dead ||
            !this.visible ||
            !V.contains(this.x, this.y, CHARACTER_WIDTH / 2)){
            return;
        }

        save();
        translate(~~this.x, ~~this.y + this.offsetY);

        // Halo
        if(!shittyMode && !this.dead){
            drawImage(this.halo, -HALO_SIZE_HALF, -HALO_SIZE_HALF);
        }

        // Dialog
        if(this.sayingTimeleft > 0 && this.saying.length){
            R.font = '16pt Arial';

            var t = this.saying[0],
                w = measureText(t).width + 8;
            R.fillStyle = '#000';
            R.globalAlpha = 0.5;
            fillRect(-w / 2, -68 - this.bubbleTailLength, w, 24);
            R.globalAlpha = 1;

            R.fillStyle = this.bodyColor;
            fillRect(-2, -40, 4, -this.bubbleTailLength);

            fillText(t, 0, -56 - this.bubbleTailLength);
        }

        // Facing left or right
        scale(this.facing * this.scaleFactorX, this.scaleFactorY);

        // Legs
        if(!this.dead){
            save();
            translate(evaluate(-CHARACTER_WIDTH / 2 + 2), evaluate(-CHARACTER_HEIGHT / 2));

            var legAmplitude = 7,
                legPeriod = 0.3,
                legLength = (sin((G.t * PI * 2) / legPeriod) / 2) * legAmplitude + legAmplitude / 2;

            var leftLegLength = this.direction || jumpCount > 0 ? legLength : legAmplitude;
            var rightLegLength = this.direction || jumpCount > 0 ? legAmplitude - legLength : legAmplitude;

            R.fillStyle = this.legColor;
            fillRect(0, 45, 6, leftLegLength);
            fillRect(30, 45, 6, rightLegLength);
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

        save();
        translate(evaluate(-CHARACTER_WIDTH / 2 - 3), evaluate(-CHARACTER_HEIGHT / 2));

        // Body
        R.fillStyle = this.bodyColor;
        fillRect(0, 0, 46, 45);

        // Eyes
        var p = 4, // blink interval
            bt = 0.3, // blink time
            mt = G.t % p, // modulo-ed time
            mi = p - bt / 2, // middle of the blink
            s = min(1, max(-mt + mi, mt - mi) / (bt / 2)), // scale of the eyes
            h = s * 4;

        if(this.dead){
            h = 1;
        }

        var eyesY = this.lookingDown ? 24 : 10;

        if(!this.fixing){
            R.fillStyle = '#000';
            var offset = this.talking ? -10 : 0;
            fillRect(27 + offset, eyesY, 4, h);
            fillRect(37 + offset, eyesY, 4, h);
        }
        restore();

        restore();
    };

    this.cycle = function(e){
        var before = {
            x: this.x,
            y: this.y
        };

        this.recoveryTime -= e;

        if((this.sayingTimeleft -= e) <= 0){
            this.say(this.saying.slice(1));
        }

        if(this.dead){
            this.direction = 0;
        }

        // Movement

        // Friction
        var frictionFactor = this.frictionFactor * this.speed,
            targetSpeed = this.direction * this.speed,
            diff = targetSpeed - this.vX,
            appliedDiff = between(-frictionFactor * e, diff, frictionFactor * e);

        this.vX = between(-this.speed, this.vX + appliedDiff, this.speed);

        this.x += this.vX * e;

        if(this.direction == -this.facing){
            interp(this, 'scaleFactorX', -1, 1, 0.1);
        }

        this.facing = this.direction || this.facing;

        // Vertical movement
        this.vY += e * GRAVITY;
        this.y += this.vY * e;

        // Collisions
        this.lastAdjustment = this.readjust(before);

        // If there has been no adjustment for up or down, it means we're in the air
        if(!(this.lastAdjustment & DOWN) && !(this.lastAdjustment & UP)){
            jumpCount = max(1, jumpCount);
        }
    };

    this.jump = function(p, f){
        if(f){
            jumpCount = 0;
        }

        if(jumpCount++ <= 1){
            this.vY = p * PLAYER_JUMP_ACCELERATION;
            previousFloorY = -1;

            var y = this.y + evaluate(CHARACTER_HEIGHT / 2);
            for(var i = 0 ; i < 5 ; i++){
                var x = rand(this.x - evaluate(CHARACTER_WIDTH / 2), this.x + evaluate(CHARACTER_WIDTH / 2));
                particle(3, '#888', [
                    ['x', x, x, 0.3],
                    ['y', y, y - rand(40, 80), 0.3],
                    ['s', 12, 0, 0.3]
                ]);
            }

            return true;
        }
    };

    this.throwAway = function(angle, force){
        this.vX = cos(angle) * force;
        this.vY = sin(angle) * force;
        this.facing = this.vX < 0 ? -1 : 1;
    };

    this.hurt = function(source, power){
        var facing = this.facing;
        if(this.recoveryTime <= 0 && !this.dead && !this.fixing){
            hitSound.play();

            this.throwAway(atan2(
                this.y - source.y,
                this.x - source.x
            ), 1500);

            this.recoveryTime = 2;

            if((this.health -= power || 1) <= 0){
                this.die();
                this.facing = facing;
            }else{
                this.say(pick([
                    nomangle('Ouch!'),
                    nomangle('health--')
                ]));
            }
        }
    };

    this.landOn = function(tiles){
        this.vY = 0;
        jumpCount = 0;

        // Find the tile that is the closest
        var tile = tiles.sort(function(a, b){
            return abs(a.center.x - P.x) - abs(b.center.x - P.x);
        })[0];

        tile.landed(this);

        if(tile.y === previousFloorY){
            return;
        }

        if(!this.dead){
            interp(this, 'bodyOffsetY', 0, 8, 0.1);
            interp(this, 'bodyOffsetY', 8, 0, 0.1, 0.1);

            for(var i = 0 ; i < 5 ; i++){
                var x = rand(this.x - evaluate(CHARACTER_WIDTH / 2), this.x + evaluate(CHARACTER_WIDTH / 2));
                particle(3, '#888', [
                    ['x', x, x, 0.3],
                    ['y', tile.y, tile.y - rand(40, 80), 0.3],
                    ['s', 12, 0, 0.3]
                ]);
            }
        }

        previousFloorY = tile.y;

        return true;
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
        var leftX = this.x - evaluate(CHARACTER_WIDTH / 2),
            rightX = this.x + evaluate(CHARACTER_WIDTH / 2),
            topY = this.y - evaluate(CHARACTER_HEIGHT / 2),
            bottomY = this.y + evaluate(CHARACTER_HEIGHT / 2);

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
            this.y = ceil(topY / TILE_SIZE) * TILE_SIZE + evaluate(CHARACTER_HEIGHT / 2);
            t |= DOWN;

            if(bottomLeft){
                this.x = ceil(leftX / TILE_SIZE) * TILE_SIZE + evaluate(CHARACTER_WIDTH / 2);
                t |= RIGHT;
            }else if(bottomRight){
                this.x = floor(rightX / TILE_SIZE) * TILE_SIZE - evaluate(CHARACTER_WIDTH / 2);
                t |= LEFT;
            }

            //this.tapOn([topLeft, topRight]);
        }

        else if(bottomLeft && bottomRight){
            this.y = floor(bottomY / TILE_SIZE) * TILE_SIZE - evaluate(CHARACTER_HEIGHT / 2);
            t |= UP;

            if(topLeft){
                this.x = ceil(leftX / TILE_SIZE) * TILE_SIZE + evaluate(CHARACTER_WIDTH / 2);
                t |= RIGHT;
            }else if(topRight){
                this.x = floor(rightX / TILE_SIZE) * TILE_SIZE - evaluate(CHARACTER_WIDTH / 2);
                t |= LEFT;
            }

            //this.landOn([bottomLeft, bottomRight]);
        }

        // Collision against a wall
        else if(topLeft && bottomLeft){
            this.x = ceil(leftX / TILE_SIZE) * TILE_SIZE + evaluate(CHARACTER_WIDTH / 2);
            t |= RIGHT;
        }

        else if(topRight && bottomRight){
            this.x = floor(rightX / TILE_SIZE) * TILE_SIZE - evaluate(CHARACTER_WIDTH / 2);
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
            this.landOn([bottomLeft, bottomRight].filter(Boolean));
        }else if(t & DOWN){
            this.tapOn([topLeft, topRight].filter(Boolean));
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
        this.health = 0;

        for(var i = 0 ; i < 40 ; i++){
            var x = rand(this.x - evaluate(CHARACTER_WIDTH / 2), this.x + evaluate(CHARACTER_WIDTH / 2)),
                y = rand(this.y - evaluate(CHARACTER_HEIGHT / 2), this.y + evaluate(CHARACTER_HEIGHT / 2)),
                yUnder = W.firstYUnder(x, this.y),
                d = rand(0.5, 1);
            particle(3, '#900', [
                ['x', x, x, 0.5],
                ['y', y, y - rand(40, 80), 0.5],
                ['s', 12, 0, 0.5]
            ]);
            particle(3, '#900', [
                ['x', x, x, d],
                ['y', y, yUnder, d, 0, easeOutBounce],
                ['s', 12, 0, d]
            ]);
        }

        this.bodyOffsetY = 8;

        interp(this, 'bodyRotation', 0, -PI / 2, 0.3);

        this.say(pick([
            nomangle('...'),
            nomangle('exit(1)'),
            nomangle('NULL'),
            nomangle('Fatal error')
        ]));
    };

    this.say = function(s){
        this.saying = s.push ? s : [s];
        this.sayingTimeleft = this.saying.length ? 3 : 0;
        if(this.saying.length){
            interp(this, 'bubbleTailLength', 0, 56, 0.3, 0, easeOutBack);
        }
    };

    return proto(this);
}
