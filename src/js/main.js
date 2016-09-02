onload = function(){
    C = D.querySelector('canvas');
    C.width = CANVAS_WIDTH;
    C.height = CANVAS_HEIGHT;

    R = C.getContext('2d');

    // Font settings are common across the game
    R.textAlign = 'center';
    R.textBaseline = 'middle';

    // Shortcut for all canvas methods
    var p;
    Object.getOwnPropertyNames(p = CanvasRenderingContext2D.prototype).forEach(function(n){
        if(R[n] && R[n].call){
            w[n] = p[n].bind(R);
        }
    });

    onresize();

    new Game();
};
