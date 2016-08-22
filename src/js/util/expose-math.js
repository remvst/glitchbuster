// Exposing all math functions to the global scope
Object.getOwnPropertyNames(Math).forEach(function(n){
    if(Math[n].call){
        this[n] = Math[n];
    }
});
