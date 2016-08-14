W.onload = function(){
    C = D.querySelector('canvas');
    C.width = CANVAS_WIDTH;
    C.height = CANVAS_HEIGHT;

    R = C.getContext('2d');

    // Font settings are common across the game
    R.textAlign = 'center';
    R.textBaseline = 'middle';

    Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype).forEach(function(name){
        try{
            W[name] = CanvasRenderingContext2D.prototype[name].bind(R);
        }catch(e){}
    });

    window.onresize();

    new Game();
};
