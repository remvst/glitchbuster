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
            this.stuck = tile;

            this.vX = this.vY = 0;

            tile.pushAway(this, GRENADE_RADIUS_2, GRENADE_RADIUS_2);
        }
    };

    this.explode = function(){
        W.destroyTileAt(this.x, this.y + TILE_SIZE);
        W.destroyTileAt(this.x - TILE_SIZE, this.y);
        W.destroyTileAt(this.x, this.y);
        W.destroyTileAt(this.x + TILE_SIZE, this.y);
        W.destroyTileAt(this.x, this.y - TILE_SIZE);

        for(var i = 0 ; i < 100 ; i++){
            var d = rand(0.5, 1.5),
                x = rand(-TILE_SIZE, TILE_SIZE) + this.x,
                y = rand(-TILE_SIZE, TILE_SIZE) + this.y;

            particle(4, pick([
                'red',
                'orange',
                'yellow'
            ]), [
                ['x', x, x, d],
                ['y', y, y - rand(100, 300), d, 0],
                ['s', rand(30, 50), 0, d]
            ]);
        }

        for(var i in W.enemies){
            var d = realDist(this, W.enemies[i]);
            if(d < TILE_SIZE * 2){
                W.enemies[i].die();
            }
        }


        var m = this;
        setTimeout(function(){
            var i = W.grenades.indexOf(m);
            if(i >= 0){
                W.grenades.splice(i, 1);
            }
        }, 0);
    };

    this.render = function(){
        R.fillStyle = 'red';
        R.fillRect(this.x - GRENADE_RADIUS, this.y - GRENADE_RADIUS, GRENADE_RADIUS_2, GRENADE_RADIUS_2);
    };
}
