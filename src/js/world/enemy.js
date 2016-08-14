function Enemy(path){
    Character.call(this);

    this.direction = 1;

    this.bodyColor = '#f00';
    this.legColor = '#b22';
    this.halo = redHalo;

    this.cycle = function(e){
        if(this.dead){
            return;
        }

        var before = {
            x: this.x,
            y: this.y
        };

        this.x += this.direction * ENEMY_SPEED * e;

        var leftX = this.x - CHARACTER_WIDTH / 2;
        var rightX = this.x + CHARACTER_WIDTH / 2;
        var bottomY = this.y + CHARACTER_HEIGHT / 2;

        var bottomLeft = W.tileAt(leftX, bottomY);
        var bottomRight = W.tileAt(rightX, bottomY);

        var adjustement = this.readjust(before);

        if(adjustement & LEFT || !bottomRight){
            this.direction = -1;
        }
        if(adjustement & RIGHT || !bottomLeft){
            this.direction = 1;
        }

        this.facing = this.direction;

        var dX = abs(P.x - this.x),
            dY = abs(P.y - this.y);
        if(dX < CHARACTER_WIDTH && dY < CHARACTER_HEIGHT){
            // Okay there's a collision, but is he landing on me or is he colliding with me?
            if(dX < dY && P.y < this.y && P.aY > 0){
                P.jump(0.8);
                this.die();

                var s = this;
                setTimeout(function(){
                    var i = W.enemies.indexOf(s);
                    if(i >= 0) W.enemies.splice(i, 1);
                }, 0);
            }else{
                P.die();
            }
        }
    };
}
