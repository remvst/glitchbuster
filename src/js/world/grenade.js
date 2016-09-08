function Grenade(x, y, angle, force, simulated){
    this.x = x;
    this.y = y;
    this.timer = 2;
    this.rotation = 0;

    this.vX = cos(angle) * force;
    this.vY = sin(angle) * force;

    this.cycle = function(e){
        var before = {
            x: this.x,
            y: this.y
        };

        if(!this.stuck || this.stuck.destroyed){
            this.stuck = null;

            this.vY += e * GRAVITY * 0.5;

            this.x += this.vX * e;
            this.y += this.vY * e;

            this.rotation += PI * 4 * e;

            var after = {
                x: this.x,
                y: this.y
            };

            // Trail
            if(!shittyMode && !simulated){
                var t = {
                    alpha: 1,
                    render: function(){
                        R.strokeStyle = 'rgba(255, 0, 0, ' + this.alpha + ')';
                        R.lineWidth = 8;
                        beginPath();
                        moveTo(before.x, before.y);
                        lineTo(after.x, after.y);
                        stroke();
                    }
                };
                G.add(t, RENDERABLE);

                interp(t, 'alpha', 1, 0, 0.3, 0, null, function(){
                    G.remove(t);
                });
            }
        }

        // Explosion
        if(!simulated){
            this.timer -= e;
            if(this.timer <= 0){
                this.explode();
            }else{
                for(var i in G.killables){
                    if(G.killables[i] != P && dist(G.killables[i], this) < CHARACTER_WIDTH / 2){
                        return this.explode(); // no need to do the rest
                    }
                }
            }
        }

        var tile = W.tileAt(this.x, this.y);
        if(tile && !this.stuck){
            this.vX *= GRENADE_BOUNCE_FACTOR;
            this.vY *= GRENADE_BOUNCE_FACTOR;

            var iterations = 0,
                adjustments;
            do{
                adjustments = tile.pushAway(this, GRENADE_RADIUS_2, GRENADE_RADIUS_2);

                if(simulated){
                    this.stuck |= adjustments;
                }

                if(adjustments & UP){
                    this.vY = -abs(this.vY);
                }
                if(adjustments & DOWN){
                    this.vY = abs(this.vY);
                }
                if(adjustments & LEFT){
                    this.vX = -abs(this.vX);
                }
                if(adjustments & RIGHT){
                    this.vX = abs(this.vX);
                }

                if(max(abs(this.vX), abs(this.vY)) < 150){
                    this.stuck = tile;
                    this.vX = this.vY = 0;
                }else{
                    // Particle when bouncing
                    if(adjustments && !shittyMode && !simulated){
                        for(var i = 0 ; i < 2 ; i++){
                            var x = this.x + rand(-8, 8),
                                y = this.y + rand(-8, 8),
                                d = rand(0.2, 0.5);
                            particle(3, '#fff', [
                                ['x', x, x, d],
                                ['y', y, y - rand(40, 80), d],
                                ['s', 12, 0, d]
                            ]);
                        }
                    }
                }
            }while(adjustments && iterations++ < 5);
        }
    };

    this.explode = function(){
        if(this.exploded){
            return;
        }

        this.exploded = true;

        [
            [this.x - TILE_SIZE, this.y + TILE_SIZE],
            [this.x, this.y + TILE_SIZE],
            [this.x + TILE_SIZE, this.y + TILE_SIZE],
            [this.x - TILE_SIZE, this.y],
            [this.x, this.y],
            [this.x + TILE_SIZE, this.y],
            [this.x - TILE_SIZE, this.y - TILE_SIZE],
            [this.x, this.y - TILE_SIZE],
            [this.x + TILE_SIZE, this.y - TILE_SIZE]
        ].forEach(function(p){
            W.destroyTileAt(p[0], p[1]);
        });

        for(var i = 0 ; i < 40 ; i++){
            var d = rand(0.5, 1.5),
                x = rand(-TILE_SIZE, TILE_SIZE) + this.x,
                y = rand(-TILE_SIZE, TILE_SIZE) + this.y;

            particle(3, pick([
                '#f00',
                '#f80',
                '#ff0'
            ]), [
                ['x', x, x + 8, d, 0, oscillate],
                ['y', y, y - rand(80, 240), d, 0],
                ['s', rand(24, 40), 0, d]
            ]);
        }

        for(i = G.killables.length ; --i >= 0 ;){
            if(dist(this, G.killables[i]) < TILE_SIZE * 2){
                G.killables[i].hurt(this, 3);
            }
        }

        G.remove(this);

        var m = this;
        delayed(function(){
            if(V.targetted == m){
                V.targetted = null;
            }
        }, 1000);

        explosionSound.play();
    };

    this.render = function(){
        save();
        translate(this.x, this.y);
        rotate(this.rotation);
        R.fillStyle = 'red';
        fillRect(-GRENADE_RADIUS, -GRENADE_RADIUS, GRENADE_RADIUS_2, GRENADE_RADIUS_2);
        restore();
    };
}
