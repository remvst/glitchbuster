function Camera(){
    // Lazy init
    this.realX = this.realY = this.x = this.y = this.offsetX = this.offsetY = 0;

    // Position at which the camera would ideally be
    this.target = function(){
        return {
            x: ~~(P.x + (P.controllable ? P.facing * 50 : 0) - CANVAS_WIDTH / 2),
            y: ~~(P.y - CANVAS_HEIGHT / 2)
        };
    };

    // Instantly moves the camera to the position where it's supposed to be
    this.forceCenter = function(e){
        var t = this.target();
        this.realX = this.x = t.x;
        this.realY = this.y = t.y;
    };

    this.cycle = function(e){
        var target = this.target(),
            dist = realDist(target, this),
            speed = dist / 0.2,
            angle = atan2(target.y - this.realY, target.x - this.realX),
            appliedDist = min(speed * e, dist);

        this.realX += cos(angle) * appliedDist;
        this.realY += sin(angle) * appliedDist;

        this.x = ~~(this.realX + this.offsetX);
        this.y = ~~(this.realY + this.offsetY);
    };
}
