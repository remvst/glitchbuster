function mirrorMask(mask){
    var exits = mask.exits;
    if(mask.exits & RIGHT){
        exits |= LEFT;
    }else{
        exits ^= LEFT;
    }
    if(mask.exits & LEFT){
        exits |= RIGHT;
    }else{
        exits ^= RIGHT;
    }

    return {
        'mask': mask.mask.map(function(r){
            return r.slice(0).reverse(); // reverse() modifies the array so we need to make a copy of it
        }),
        'exits': exits
    };
}
