function HealthItem(x, y){
    Item.call(this, x, y, HEALTH);

    this.renderItem = function(){
        var o = -requiredCells('!', 5) * 5 / 2;
        drawText(R, '!', o, o, 5, '#f00');
    };

    this.pickup = function(){
        P.health++;
        P.say(nomangle('health++')); // TODO more strings
    };
}
