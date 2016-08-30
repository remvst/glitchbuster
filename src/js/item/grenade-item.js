function GrenadeItem(x, y){
    Item.call(this, x, y);

    this.renderItem = function(){
        R.fillStyle = 'red';
        rotate(PI / 4);
        fillRect(-GRENADE_RADIUS, -GRENADE_RADIUS, GRENADE_RADIUS_2, GRENADE_RADIUS_2);
    };

    this.pickup = function(){
        P.grenades++;

        P.say([pick([
            nomangle('Here\'s a breakpoint!'),
            nomangle('You found a breakpoint!'),
            nomangle('That\'s a breakpoint!')
        ]), nomangle('Press SPACE to throw it')]);
    };
}
