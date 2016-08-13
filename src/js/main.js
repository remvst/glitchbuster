W.onload = function(){
    C = D.querySelector('canvas');
    C.width = CANVAS_WIDTH;
    C.height = CANVAS_HEIGHT;

    R = C.getContext('2d');

    Object.getOwnPropertyNames(CanvasRenderingContext2D.prototype).forEach(function(name){
        try{
            W[name] = CanvasRenderingContext2D.prototype[name].bind(R);
        }catch(e){}
    });

    window.onresize();

    G = new Game();
};
