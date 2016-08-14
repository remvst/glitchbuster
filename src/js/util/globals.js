var W = window,
    D = document,
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
Object.getOwnPropertyNames(Math).forEach(function(n){
    W[n] = M[n];
});

var raf = (function(){
    return  W.requestAnimationFrame       ||
            W.webkitRequestAnimationFrame ||
            W.mozRequestAnimationFrame    ||
            function(c){
                T(c, 1000 / 60);
            };
})();

var toBool = function(x){
    return !!x;
};
