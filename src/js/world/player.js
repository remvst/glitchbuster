function Player(){
    Character.call(this);

    this.controllable = true;

    this.grenades = 0;
    this.health = 5;

    this.bodyColor = '#fff';
    this.legColor = '#aaa';
    this.halo = whiteHalo;

    this.speed = PLAYER_SPEED;

    var superCycle = this.cycle;
    this.cycle = function(e){
        if(!this.controllable){
            this.direction = 0;
        }else{
            var d = dist(this, W.exit.center);
            if(d < TILE_SIZE / 2){
                this.controllable = false;
                this.fixing = true;

                this.say([
                    string('Let\'s fix this...'),
                    string('Done!')
                ]);

                interp(this, 'x', this.x, W.exit.center.x, 1);
                interp(W.exit, 'alpha', 1, 0, 3);

                setTimeout(function(){
                    G.applyGlitch(0, 0.5);
                    G.hideTiles = true;
                }, 3500);

                setTimeout(function(){
                    G.startNewWorld();
                }, 4000);
            }else if(d < CANVAS_WIDTH * 0.5 && !this.found){
                this.found = true;
                this.say(string('You found the bug!')); // TODO more strings
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
        if(this.controllable){
            superJump.call(this, p, f);
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
        }else{
            P.say(pick([
                string('You don\'t have any breakpoints'),
                string('breakpoints.count == 0'),
                string('Breakpoint not found')
            ]));
        }

        this.grenades = max(0, this.grenades);
    };
}
