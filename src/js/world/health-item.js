function HealthItem(x, y){
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

        R.fillStyle = 'red';
        fillRect(-GRENADE_RADIUS, -GRENADE_RADIUS, GRENADE_RADIUS_2, GRENADE_RADIUS_2);

        // Arrow
        R.fillStyle = '#fff';
        beginPath();
        moveTo(-ARROW_SIZE / 2, -ARROW_SIZE / 2 + GRENADE_ARROW_Y_OFFSET);
        lineTo(ARROW_SIZE / 2, -ARROW_SIZE / 2 + GRENADE_ARROW_Y_OFFSET);
        lineTo(0, GRENADE_ARROW_Y_OFFSET);
        fill();

        restore();
    };

    this.cycle = function(){
        if(dist(this, P) < GRENADE_PICKUP_RADIUS && !this.pickedUp){
            var m = this;
            T(function(){
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

            P.health++;
            this.pickedUp = true;
            pickupSound.play();

            P.say(nomangle('health++')); // TODO more strings
        }
    };
}
