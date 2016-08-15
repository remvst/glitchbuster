function mirrorMask(mask){
    return {
        'mask': mask.mask.map(function(r){
            return r.reverse();
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
