function Enemy(){
    Character.call(this);

    this.bodyColor = '#f00';
    this.legColor = '#b22';
    this.halo = redHalo;
    this.health = 1;
    this.speed = 0;

    var superCycle = this.cycle;
    this.cycle = function(e){
        // Skipping cycles for far enemies
        if(!V.contains(this.x, this.y, CHARACTER_WIDTH / 2)){
            return;
        }

        superCycle.call(this, e);

        if(this.sayingTimeleft <= 0){
            this.say('0x' + (~~rand(0x100000, 0xffffff)).toString(16));
        }

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
        }
    };

    var superDie = this.die;
    this.die = function(){
        superDie.call(this);

        var s = this;
        delayed(function(){
            remove(G.cyclables, s);
            remove(G.killables, s);
        }, 0);

        delayed(function(){
            remove(G.renderables, s);
        }, 3000);

        interp(this, 'scaleFactor', 1, 0, 2.5, 0.5);
    };
}
