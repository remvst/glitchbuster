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

        if(this.sayingTimeleft <= 0){
            this.say('0x' + (~~rand(0x100000, 0xffffff)).toString(16));
        }

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
        }
    };

    this.die = function(){
        if(!this.dead){
            sup.die();

            var s = this;

            interp(this, 'scaleFactor', 1, 0, 0.8, 0.5, null, function(){
                delayed(function(){
                    remove(G.cyclables, s);
                    remove(G.killables, s);
                    remove(G.renderables, s);
                }, 0);

                if(rand() < ENEMY_DROP_PROBABILITY){
                    var t = pick([HealthItem, GrenadeItem]);

                    // Drop an health item
                    var item = new t(s.x, s.y);
                    G.renderables.push(item);
                    G.cyclables.push(item);

                    item.particles();
                }
            });
        }
    };
}
