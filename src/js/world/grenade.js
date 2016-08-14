function Grenade(){
    this.x = this.y = 0;
    this.timer = 2;

    this.throw = function(angle, force){
        this.vX = cos(angle) * force;
        this.vY = sin(angle) * force;
    };

    this.cycle = function(e){
        if(!this.stuck){
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
            this.stuck = true;

            tile.pushAway(this, GRENADE_RADIUS_2, GRENADE_RADIUS_2);
        }
    };

    this.explode = function(){
        W.destroyTileAt(this.x, this.y + TILE_SIZE);
        W.destroyTileAt(this.x - TILE_SIZE, this.y);
        W.destroyTileAt(this.x, this.y);
        W.destroyTileAt(this.x + TILE_SIZE, this.y);
        W.destroyTileAt(this.x, this.y - TILE_SIZE);


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
