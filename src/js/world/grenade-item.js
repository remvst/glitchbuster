function GrenadeItem(x, y){
    this.x = x;
    this.y = y;

    this.render = function(){
        save();
        translate(x, y);

        drawImage(whiteHalo, -HALO_SIZE_HALF, -HALO_SIZE_HALF);

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
        if(realDist(this, P) < GRENADE_PICKUP_RADIUS && !this.pickedUp){
            var m = this;
            setTimeout(function(){
                remove(W.cyclables, m);
                remove(W.renderables, m);
            }, 0);

            P.grenades++;

            this.pickedUp = true;
        }
    };
}