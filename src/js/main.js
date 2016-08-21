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
        R[n] && R[n].call && (window[n] = CanvasRenderingContext2D.prototype[n].bind(R));
    });

    window.sound = new Audio();
    window.sound.src = jsfxr([0,,0.3964,,0.1599,0.5351,,0.1451,,,,,,0.4277,,,,,0.7854,,,,,0.5]);

    onresize();

    new Game();
};
