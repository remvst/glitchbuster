function Player(){
    var sup = Character.call(this);

    this.controllable = true;

    this.grenades = 0;
    this.health = PLAYER_INITIAL_HEALTH;

    this.bodyColor = '#fff';
    this.legColor = '#aaa';
    this.halo = whiteHalo;

    this.speed = PLAYER_SPEED;

    this.preparingGrenade = false;
    this.grenadePreparation = 0;

    this.cycle = function(e){
        if(!this.controllable){
            this.direction = 0;
        }else{
            if(this.direction){
                V.targetted = null;
            }

            var d = dist(this, W.exit.center);
            if(d < evaluate(TILE_SIZE / 2)){
                this.controllable = false;
                this.fixing = true;

                this.say([
                    nomangle('Let\'s fix this...'),
                    nomangle('Done!')
                ]);

                interp(this, 'x', this.x, W.exit.center.x, 1);
                interp(W.exit, 'alpha', 1, 0, 3);

                delayed(function(){
                    fixedSound.play();
                    G.bugFixed();
                }, 3500);
            }else if(d < (CANVAS_WIDTH / 2) && !this.found){
                this.found = true;
                this.say(nomangle('You found the bug!')); // TODO more strings
            }
        }

        this.grenadePreparation = (this.grenadePreparation + e / 4) % 1;

        sup.cycle(e);
    };

    this.die = function(){
        sup.die();
        G.playerDied();
    };

    this.jump = function(p, f){
        if(this.controllable && sup.jump(p, f)){
            jumpSound.play();
        }
    };

    this.prepareGrenade = function(){
        if(this.grenades){
            this.preparingGrenade = true;
            this.grenadePreparation = 0;
        }else{
            P.say(pick([
                nomangle('You don\'t have any breakpoints'),
                nomangle('breakpoints.count == 0'),
                nomangle('NoBreakpointException')
            ]));
        }
    };

    this.grenadePower = function(){
        return 500 + (1 - abs((this.grenadePreparation - 0.5) * 2)) * 1500;
    };

    this.throwGrenade = function(){
        if(this.preparingGrenade && !this.dead){
            var g = new Grenade(
                this.x,
                this.y,
                -PI / 2 + this.facing * PI / 4,
                this.grenadePower()
            );
            G.add(g, evaluate(RENDERABLE | CYCLABLE));

            V.targetted = g; // make the camera target the grenade

            this.preparingGrenade = false;
            this.grenades = max(0, this.grenades - 1);
        }
    };

    this.say = function(a){
        sup.say(a);
        if(a && a.length){
            saySound.play();
        }
    };

    this.landOn = function(t){
        if(sup.landOn(t)){
            landSound.play();
        }
    };

    this.render = function(e){
        sup.render(e);

        if(this.preparingGrenade){
            var g = new Grenade(
                this.x,
                this.y,
                -PI / 2 + this.facing * PI / 4,
                this.grenadePower(),
                true
            );

            R.fillStyle = '#fff';
            for(var i = 0 ; i < 40 && !g.stuck ; i++){
                g.cycle(1 / 60);

                if(!(i % 2)){
                    fillRect(~~g.x - 2, ~~g.y - 2, 4, 4);
                }
            }
        }
    };
}
