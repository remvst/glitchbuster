function rand(a, b){
    // ~~b -> 0
    return random() * ((a || 1) - ~~b) + ~~b;
}
