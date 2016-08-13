var W = window,
    D = document,
    M = Math,
    T = setTimeout,
    C, // canvas
    R, // canvas context
    W, // world
    P, // player
    V, // camera,
    K = {}, // keyboard
    noop = function(){}
    ;

// Exposing all math functions to the global scope
Object.getOwnPropertyNames(M).forEach(function(name){
    W[name] = M[name];
});

var raf = (function(){
    return  W.requestAnimationFrame       ||
            W.webkitRequestAnimationFrame ||
            W.mozRequestAnimationFrame    ||
            function(c){
                T(c, 1000 / 60);
            };
})();
