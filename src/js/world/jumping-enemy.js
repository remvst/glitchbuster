function JumpingEnemy(){
    Enemy.call(this);

    this.nextJump = 4;
    this.frictionFactor = 0;

    this.speed = JUMPING_ENEMY_SPEED;

    var superCycle = this.cycle;
    this.cycle = function(e){
        superCycle.call(this, e);

        if((this.nextJump -= e) <= 0 && !this.dead){
            this.vX = (this.direction = this.facing = pick([-1, 1])) * this.speed;

            this.jump(0.8);
            this.nextJump = 2;
        }
    };

    var superLandOn = this.landOn;
    this.landOn = function(t){
        superLandOn.call(this, t);
        this.vX = 0;
        this.direction = 0;
    };
}
