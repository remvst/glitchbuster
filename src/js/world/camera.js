function Camera(){
    // Lazy init
    this.realX = this.realY = this.x = this.y = this.offsetX = this.offsetY = 0;

    // Position at which the camera would ideally be
    this.target = function(){
        return {
            x: ~~(P.x + (P.controllable ? P.facing * 50 : 0) - CANVAS_WIDTH / 2),
            y: ~~(P.y - CANVAS_HEIGHT / 2 + (P.lookingDown ? 300 : 0))
        };
    };

    // Instantly moves the camera to the position where it's supposed to be
    this.forceCenter = function(e){
        var t = this.target();
        this.realX = this.x = t.x;
        this.realY = this.y = t.y;
    };

    this.contains = function(x, y, d){
        return x + d > this.x &&
                y + d > this.y &&
                x - d < this.x + CANVAS_WIDTH &&
                y - d < this.y + CANVAS_HEIGHT;
    };

    this.cycle = function(e){
        var target = this.target(),
            d = dist(target, this),
            speed = max(1, d / 0.2),
            angle = atan2(target.y - this.realY, target.x - this.realX),
            appliedDist = min(speed * e, d);

        if(d > 1){
            this.realX += cos(angle) * appliedDist;
            this.realY += sin(angle) * appliedDist;
        }

        this.x = ~~(this.realX + this.offsetX);
        this.y = ~~(this.realY + this.offsetY);
    };
}
