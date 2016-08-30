function pickMask(masks, requirements){
    return pick(masks.filter(function(m){
        return m.exits == requirements;
    }));
}


function generateWorld(id){
    if(!id){
        return pad(tutorialLevel, WORLD_PADDING);
    }

    // Mirror all the masks to have more possibilities
    var usedMasks = masks.concat(masks.map(mirrorMask));

    var maskMapRows = id < 0 ? 4 : round((id - 1) * 0.2 + 2),
        maskMapCols = id < 0 ? 5 : round((id - 1) * 0.1 + 3),
        maskMap = [],
        col,
        row,
        downCols = [],
        cols = [];

    for(col = 0 ; col < maskMapCols ; col++){
        cols.push(col);
    }

    for(row = 0 ; row < maskMapRows ; row++){
        maskMap.push([]);

        for(col = 0 ; col < maskMapCols ; col++){
            maskMap[row][col] = 0;

            // The tile above was going down, need to ensure there's a to this one
            if(downCols.indexOf(col) >= 0){
                maskMap[row][col] |= UP;
            }

            // Need to connect left if we're not on the far left
            if(col > 0){
                maskMap[row][col] |= LEFT;
            }

            // Need to connect right if we're not on the far right
            if(col < maskMapCols - 1){
                maskMap[row][col] |= RIGHT;
            }
        }

        // Generate the link to the lower row
        if(row < maskMapRows - 1){
            downCols = pick(cols, pick([1, 2, 3]), true);
            downCols.forEach(function(col){
                maskMap[row][col] |= DOWN;
            });
        }
    }

    var map = [];
    for(row = 0 ; row < maskMapRows * MASK_ROWS ; row++){
        map[row] = [];
    }

    function applyMask(matrix, mask, rowStart, colStart){
        for(var row = 0 ; row < MASK_ROWS ; row++){
            for(var col = 0 ; col < MASK_COLS ; col++){
                matrix[row + rowStart][col + colStart] = mask[row][col];
            }
        }
    }

    for(row = 0 ; row < maskMapRows ; row++){
        for(col = 0 ; col < maskMapCols ; col++){

            var mask = pickMask(usedMasks, maskMap[row][col]).mask;

            // Apply mask
            applyMask(map, mask, row * MASK_ROWS, col * MASK_COLS);
        }
    }

    var finalMap = [],
        floors = [],
        ceilings = [];

    for(row = 0 ; row < map.length ; row++){
        finalMap.push([]);

        map[row][col] = parseInt(map[row][col]);

        for(col = 0 ; col < map[row].length ; col++){
            finalMap[row].push(map[row][col]);

            // Probabilistic wall, let's decide now
            if(map[row][col] == PROBABLE_TILE_ID){
                finalMap[row][col] = rand() < PROBABLE_TILE_PROBABILITY ? 1 : 0;
            }

            // Detect floors and ceilings to add spikes, spawn and exit
            if(row > 0){
                if(finalMap[row][col] == TILE_ID && finalMap[row - 1][col] == VOID_ID){
                    floors.push([row, col]);
                }

                if(finalMap[row][col] == VOID_ID && finalMap[row - 1][col] == TILE_ID){
                    ceilings.push([row - 1, col]);
                }
            }
        }
    }

    // Add a random spawn and a random exit
    var spawn = pick(floors.slice(0, floors.length * 0.1));
    var exit = pick(floors.slice(floors.length * 0.9));

    finalMap[spawn[0] - 1][spawn[1]] = SPAWN_ID;
    finalMap[exit[0] - 1][exit[1]] = EXIT_ID;
    finalMap[exit[0]][exit[1]] = UNBREAKABLE_TILE_ID;

    // Add random spikes
    floors.forEach(function(f){
        if(f != exit && f != spawn && rand() < SPIKE_DENSITY){
            finalMap[f[0]][f[1]] = FLOOR_SPIKE_ID;
        }
    });

    ceilings.forEach(function(f){
        if(f != exit && f != spawn && rand() < SPIKE_DENSITY){
            finalMap[f[0]][f[1]] = CEILING_SPIKE_ID;
        }
    });

    return pad(finalMap, WORLD_PADDING);
}
