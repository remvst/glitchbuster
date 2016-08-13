function Enemy(path){
    Character.call(this);

    this.direction = 1;

    this.bodyColor = '#f00';
    this.legColor = '#b22';
    this.halo = redHalo;

    this.cycle = function(e){
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

        var d = realDist(this, P);
        if(d < CHARACTER_WIDTH){
            P.die();
        }
    };
}
