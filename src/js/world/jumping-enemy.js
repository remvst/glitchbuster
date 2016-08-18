function JumpingEnemy(){
    Enemy.call(this);

    this.nextJump = 0;

    this.speed = 0;

    var superCycle = this.cycle;
    this.cycle = function(e){
        superCycle.call(this, e);
    };
}
