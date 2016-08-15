function Grenade(){
    this.x = this.y = 0;
    this.timer = 2;

    this.throw = function(angle, force){
        this.vX = cos(angle) * force;
        this.vY = sin(angle) * force;
    };

    this.cycle = function(e){
        if(!this.stuck || this.stuck.destroyed){
            this.stuck = null;

            this.vY += e * GRAVITY * 0.5;

            this.x += this.vX * e;
            this.y += this.vY * e;
        }

        this.timer -= e;
        if(this.timer <= 0){
            this.explode();
        }

        var tile = W.tileAt(this.x, this.y);
        if(tile && !this.stuck){
            this.vX *= GRENADE_BOUNCE_FACTOR;
            this.vY *= GRENADE_BOUNCE_FACTOR;

            var iterations = 0,
                adjustments;
            do{
                adjustments = tile.pushAway(this, GRENADE_RADIUS_2, GRENADE_RADIUS_2);

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
                }
            }while(adjustments && iterations++ < 5);
        }
    };

    this.explode = function(){
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

        for(var i = 0 ; i < 100 ; i++){
            var d = rand(0.5, 1.5),
                x = rand(-TILE_SIZE, TILE_SIZE) + this.x,
                y = rand(-TILE_SIZE, TILE_SIZE) + this.y;

            particle(4, pick([
                'red',
                'orange',
                'yellow'
            ]), [
                ['x', x, x + 10, d, 0, oscillate],
                ['y', y, y - rand(100, 300), d, 0],
                ['s', rand(30, 50), 0, d]
            ]);
        }

        for(var i in G.killables){
            var d = realDist(this, G.killables[i]);
            if(d < TILE_SIZE * 2){
                G.killables[i].die();
            }
        }


        var m = this;
        setTimeout(function(){
            remove(G.cyclables, m);
            remove(G.renderables, m);
        }, 0);
    };

    this.render = function(){
        R.fillStyle = 'red';
        R.fillRect(this.x - GRENADE_RADIUS, this.y - GRENADE_RADIUS, GRENADE_RADIUS_2, GRENADE_RADIUS_2);
    };
}
