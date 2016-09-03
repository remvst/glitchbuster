function Camera(){
    // Lazy init
    this.realX = this.realY = this.x = this.y = this.offsetX = this.offsetY = 0;

    // Position at which the camera would ideally be
    this.target = function(){
        var x, y;
        if(!this.targetted){
            x = P.x + (P.controllable ? P.facing * 50 : 0);
            y = P.y + (P.controllable && P.lookingDown ? 400 : 0);
        }else{
            x = this.targetted.x;
            y = this.targetted.y;
        }
        return {
            x: ~~(x - CANVAS_WIDTH / 2),
            y: ~~(y - CANVAS_HEIGHT / 2)
        };
    };

    // Instantly moves the camera to the position where it's supposed to be
    this.forceCenter = function(e){
        var t = this.target();
        this.realX = this.x = t.x;
        this.realY = this.y = t.y;
    };

    this.contains = function(x, y, d){
        return between(this.x - d, x, this.x + CANVAS_WIDTH + d) &&
                between(this.y - d, y, this.y + CANVAS_HEIGHT + d);
    };

    this.cycle = function(e){
        var target = this.target(),
            d = dist(target, this),
            speed = max(1, d / 0.2),
            angle = atan2(target.y - this.realY, target.x - this.realX),
            appliedDist = min(speed * e, d);

        var px = 1 / G.resolution;

        if(d > px){
            this.realX += cos(angle) * appliedDist;
            this.realY += sin(angle) * appliedDist;
        }

        this.x = ~~((this.realX + this.offsetX) / px) * px;
        this.y = ~~((this.realY + this.offsetY) / px) * px;
    };
}
