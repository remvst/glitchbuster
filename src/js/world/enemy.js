function Enemy(){
    Character.call(this);

    this.direction = 1;

    this.bodyColor = '#f00';
    this.legColor = '#b22';
    this.halo = redHalo;
    this.health = 1;

    this.sayingTimeleft = 0;

    this.cycle = function(e){
        if(!this.dead){
            if((this.sayingTimeleft -= e) <= 0){
                this.say('0x' + (~~rand(0x100000, 0xffffff)).toString(16));
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

            if(adjustement & LEFT || !bottomRight || (bottomRight.type > UNBREAKABLE_TILE_ID)){
                this.direction = -1;
            }
            if(adjustement & RIGHT || !bottomLeft || (bottomLeft.type > UNBREAKABLE_TILE_ID)){
                this.direction = 1;
            }

            this.facing = this.direction;

            var dX = abs(P.x - this.x),
                dY = abs(P.y - this.y);
            if(dX < CHARACTER_WIDTH && dY < CHARACTER_HEIGHT){
                // Okay there's a collision, but is he landing on me or is he colliding with me?
                if(dX < dY && P.y < this.y && P.vY > 0){
                    P.jump(0.8, true);
                    this.die();
                }else{
                    P.hurt(this);
                    this.direction = this.x > P.x ? 1 : -1;
                }
            }
        }
    };

    var superDie = this.die;
    this.die = function(){
        superDie.call(this);

        var s = this;
        setTimeout(function(){
            remove(G.cyclables, s);
            remove(G.killables, s);
        }, 0);

        setTimeout(function(){
            remove(G.renderables, s);
        }, 3000);

        interp(this, 'scaleFactor', 1, 0, 2.5, 0.5);
    };
}
