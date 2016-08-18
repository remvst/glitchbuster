function WalkingEnemy(){
    Enemy.call(this);

    this.speed = ENEMY_SPEED;

    var superCycle = this.cycle;
    this.cycle = function(e){
        superCycle.call(this, e);

        if(!this.dead){
            var leftX = this.x - CHARACTER_WIDTH / 2;
            var rightX = this.x + CHARACTER_WIDTH / 2;
            var bottomY = this.y + CHARACTER_HEIGHT / 2;

            var bottomLeft = W.tileAt(leftX, bottomY);
            var bottomRight = W.tileAt(rightX, bottomY);

            if(this.lastAdjustment & LEFT || !bottomRight || bottomRight.type > CEILING_SPIKE_ID){
                this.direction = -1;
            }
            if(this.lastAdjustment & RIGHT || !bottomLeft || bottomLeft.type > CEILING_SPIKE_ID){
                this.direction = 1;
            }
        }
    };
}
