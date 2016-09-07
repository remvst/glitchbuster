function JumpingEnemy(x, y){
    var sup = Enemy.call(this, x, y);

    this.nextJump = 4;
    this.frictionFactor = 0;

    this.speed = JUMPING_ENEMY_SPEED;

    this.cycle = function(e){
        sup.cycle(e);

        if((this.nextJump -= e) <= 0 && !this.dead){
            this.vX = (this.direction = this.facing = pick([-1, 1])) * this.speed;

            this.jump(0.8);
            this.nextJump = rand(1.5, 2.5);
        }
    };

    this.landOn = function(t){
        sup.landOn(t);
        this.vX = 0;
        this.direction = 0;
    };
}
