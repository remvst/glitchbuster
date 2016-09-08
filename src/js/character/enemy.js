function Enemy(x, y){
    var sup = Character.call(this);

    this.x = x;
    this.y = y;

    this.bodyColor = '#f00';
    this.legColor = '#b22';
    this.halo = redHalo;
    this.health = 1;
    this.speed = 0;

    this.cycle = function(e){
        // Skipping cycles for far enemies
        if(V.contains(this.x, this.y, evaluate(CHARACTER_WIDTH / 2))){
            sup.cycle(e);

            if(!this.dead){
                var dX = abs(P.x - this.x),
                    dY = abs(P.y - this.y);
                if(dX < CHARACTER_WIDTH && dY < CHARACTER_HEIGHT){
                    // Okay there's a collision, but is he landing on me or is he colliding with me?
                    if(dX < dY && P.y < this.y && P.vY > 0){
                        P.jump(0.8, true);
                        this.hurt(P);
                    }else{
                        P.hurt(this);
                        this.direction = this.x > P.x ? 1 : -1;
                    }
                }

                // Say random shit
                if(this.sayingTimeleft <= 0){
                    this.say('0x' + (~~rand(0x100000, 0xffffff)).toString(16));
                }
            }
        }
    };

    this.die = function(){
        if(!this.dead){
            sup.die();

            var s = this;

            delayed(function(){
                s.say([]);

                // Fly away animation
                interp(s, 'scaleFactorX', 1, 0, 0.4);
                interp(s, 'scaleFactorY', 1, 5, 0.3, 0.1);
                interp(s, 'offsetY', 0, -400, 0.3, 0.1, null, function(){
                    delayed(function(){
                        G.remove(s);
                    }, 0);
                });

                // Item drop
                G.droppable(s.x, s.y, ENEMY_DROP_PROBABILITY, true);
            }, 500);
        }
    };

    return proto(this);
}
