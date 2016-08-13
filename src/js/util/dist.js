// Manhattan distance
function dist(a, b){
    return abs(a.x - b.x) + abs(a.y - b.y);
}

// Actual distance
function realDist(a, b){
    return sqrt(pow(a.x - b.x, 2) + pow(a.y - b.y, 2));
}
