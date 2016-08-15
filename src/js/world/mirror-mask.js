function mirrorMask(mask){
    return {
        'mask': mask.mask.map(function(r){
            return r.slice(0).reverse(); // reverse() modifies the array so we need to make a copy of it
        }),
        'exits': mask.exits.map(function(e){
            if(e === RIGHT){
                return LEFT;
            }
            if(e === LEFT){
                return RIGHT;
            }
            return e;
        })
    };
}
