var D = document,
    T = setTimeout,
    C, // canvas
    R, // canvas context
    W, // world
    P, // player
    V, // camera,
    K = {}, // keyboard
    raf = (function(){
        return  this.requestAnimationFrame       ||
                this.webkitRequestAnimationFrame ||
                this.mozRequestAnimationFrame    ||
                function(c){
                    T(c, 1000 / 60);
                };
    })();

// Exposing all math functions to the global scope
Object.getOwnPropertyNames(Math).forEach(function(n){
    this[n] = Math[n];
});
