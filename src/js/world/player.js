function Player(){
    Character.call(this);

    this.controllable = true;

    this.grenades = 0;
    this.health = PLAYER_INITIAL_HEALTH;

    this.bodyColor = '#fff';
    this.legColor = '#aaa';
    this.halo = whiteHalo;

    this.speed = PLAYER_SPEED;

    this.preparingGrenade = false;

    var superCycle = this.cycle;
    this.cycle = function(e){
        if(!this.controllable){
            this.direction = 0;
        }else{
            if(this.direction){
                V.targetted = null;
            }

            var d = dist(this, W.exit.center);
            if(d < TILE_SIZE / 2){
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
            }else if(d < CANVAS_WIDTH * 0.5 && !this.found){
                this.found = true;
                this.say(nomangle('You found the bug!')); // TODO more strings
            }
        }

        superCycle.call(this, e);
    };

    var superDie = this.die;
    this.die = function(){
        superDie.call(this);
        G.playerDied();
    };

    var superJump = this.jump;
    this.jump = function(p, f){
        if(this.controllable && superJump.call(this, p, f)){
            jumpSound.play();
        }
    };

    this.throwGrenade = function(){
        if(!this.dead && this.grenades-- > 0){
            var g = new Grenade();
            g.x = this.x;
            g.y = this.y;
            g.throw(-PI / 2 + this.facing * PI / 3, 1000);
            G.cyclables.push(g);
            G.renderables.push(g);

            V.targetted = g; // make the camera target the grenade
        }else{
            P.say(pick([
                nomangle('You don\'t have any breakpoints'),
                nomangle('breakpoints.count == 0'),
                nomangle('Breakpoint not found')
            ]));
        }

        this.grenades = max(0, this.grenades);
    };

    var superSay = this.say;
    this.say = function(a){
        superSay.call(this, a);
        if(a && a.length){
            saySound.play();
        }
    };

    var superLand = this.landOn;
    this.landOn = function(t){
        if(superLand.call(this, t)){
            landSound.play();
        }
    };

    var superRender = this.render;
    this.render = function(e){
        superRender.call(this, e);

        if(this.preparingGrenade){
            var g = new Grenade(true);
            g.x = this.x;
            g.y = this.y;
            g.throw(-PI / 2 + this.facing * PI / 3, 1000);

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
