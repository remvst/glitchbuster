onload = function(){
    C = D.querySelector('canvas');
    C.width = CANVAS_WIDTH;
    C.height = CANVAS_HEIGHT;

    R = C.getContext('2d');

    // Font settings are common across the game
    R.textAlign = 'center';
    R.textBaseline = 'middle';

    // Shortcut for all canvas methods
    Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype).forEach(function(n){
        R[n].call && (W[n] = CanvasRenderingContext2D.prototype[n].bind(R));
    });

    onresize();

    new Game();
};
