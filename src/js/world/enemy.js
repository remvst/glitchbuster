function Enemy(){
    Character.call(this);

    var sup = proto(this);

    this.bodyColor = '#f00';
    this.legColor = '#b22';
    this.halo = redHalo;
    this.health = 1;
    this.speed = 0;

    this.cycle = function(e){
        // Skipping cycles for far enemies
        if(!V.contains(this.x, this.y, evaluate(CHARACTER_WIDTH / 2))){
            return;
        }

        sup.cycle(e);

        if(!this.dead){
            var dX = abs(P.x - this.x),
                dY = abs(P.y - this.y);
            if(dX < CHARACTER_WIDTH && dY < CHARACTER_HEIGHT){
                // Okay there's a collision, but is he landing on me or is he colliding with me?
                if(dX < dY && P.y < this.y && P.vY > 0){
                    P.jump(1, true);
                    this.hurt(P);
                }else{
                    P.hurt(this);
                    this.direction = this.x > P.x ? 1 : -1;
                }
            }

            if(this.sayingTimeleft <= 0){
                this.say('0x' + (~~rand(0x100000, 0xffffff)).toString(16));
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
                        remove(G.cyclables, s);
                        remove(G.killables, s);
                        remove(G.renderables, s);
                    }, 0);
                });

                // Item drop
                // TODO check if the player's inventory is full
                if(rand() < ENEMY_DROP_PROBABILITY){
                    var t = pick([HealthItem, GrenadeItem]);

                    // Drop an health item
                    var item = new t(s.x, s.y);
                    G.renderables.push(item);
                    G.cyclables.push(item);

                    item.particles();
                }
            }, 500);
        }
    };
}
