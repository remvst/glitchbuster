function pad(m, n){
    var r = [];
    for(var row = 0 ; row < m.length + n * 2 ; row++){
        r.push([]);
        for(var col = 0 ; col < m[0].length + n * 2 ; col++){
            if(row < n || row >= m.length + n || col < n || col >= m[0].length + n){
                r[row][col] = UNBREAKABLE_TILE_ID;
            }else{
                r[row][col] = m[row - n][col - n];
            }
        }
    }
    return r;
}
