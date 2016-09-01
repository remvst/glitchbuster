function Item(x, y){
    this.x = x;
    this.y = y;

    this.render = function(){
        if(!V.contains(this.x, this.y, TILE_SIZE)){
            return;
        }

        save();
        translate(x, y);

        if(!shittyMode){
            drawImage(whiteHalo, -HALO_SIZE_HALF, -HALO_SIZE_HALF);
        }

        var arrowOffsetY = sin(G.t * PI * 2 * 0.5) * 10 + ITEM_ARROW_Y_OFFSET;

        // Arrow
        R.fillStyle = '#fff';
        beginPath();
        moveTo(-ARROW_SIZE / 2, -ARROW_SIZE / 2 + arrowOffsetY);
        lineTo(ARROW_SIZE / 2, -ARROW_SIZE / 2 + arrowOffsetY);
        lineTo(0, arrowOffsetY);
        fill();

        this.renderItem(); // defined in subclasses

        restore();
    };

    this.cycle = function(){
        if(dist(this, P) < ITEM_PICKUP_RADIUS && !this.pickedUp){
            var m = this;
            delayed(function(){
                remove(G.cyclables, m);
                remove(G.renderables, m);
            }, 0);

            for(var i = 0 ; i < 10 ; i++){
                var x = rand(this.x - TILE_SIZE / 4, this.x + TILE_SIZE / 4),
                    y = rand(this.y - TILE_SIZE / 4, this.y + TILE_SIZE / 4),
                    d = rand(0.2, 0.5);
                particle(4, '#fff', [
                    ['x', x, x, 0.5],
                    ['y', y, y - rand(50, 100), 0.5],
                    ['s', 15, 0, 0.5]
                ]);
            }

            this.pickedUp = true;
            pickupSound.play();

            this.pickup(); // defined in subclasses
        }
    };
}
