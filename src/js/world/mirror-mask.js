function mirrorMask(mask){
    var mirroredExits = mask.exits;
    if(mask.exits & RIGHT){
        mirroredExits |= LEFT;
    }else{
        mirroredExits ^= LEFT;
    }
    if(mask.exits & LEFT){
        mirroredExits |= RIGHT;
    }else{
        mirroredExits ^= RIGHT;
    }

    return {
        'mask': mask.mask.map(function(r){
            return r.slice(0).reverse(); // reverse() modifies the array so we need to make a copy of it
        }),
        'exits': mirroredExits
    };
}
