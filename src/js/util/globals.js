var W = window,
    D = document,
    T = setTimeout,
    C, // canvas
    R, // canvas context
    W, // world
    P, // player
    V, // camera,
    K = {}, // keyboard
    noop = function(){},
    raf = (function(){
        return  W.requestAnimationFrame       ||
                W.webkitRequestAnimationFrame ||
                W.mozRequestAnimationFrame    ||
                function(c){
                    T(c, 1000 / 60);
                };
    })(),
    toBool = function(x){
        return !!x;
    };

// Exposing all math functions to the global scope
Object.getOwnPropertyNames(Math).forEach(function(n){
    W[n] = Math[n];
});
