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

    var maskMapRows = id < 0 ? 4 : round((id - 1) * 0.4 + 2),
        maskMapCols = id < 0 ? 5 : round((id - 1) * 0.2 + 3),
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

    var matrix = [];
    for(row = 0 ; row < maskMapRows * MASK_ROWS ; row++){
        matrix[row] = [];
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
            applyMask(matrix, mask, row * MASK_ROWS, col * MASK_COLS);
        }
    }

    var finalMap = [],
        floors = [],
        ceilings = [],
        floorsMap = [];

    for(row = 0 ; row < matrix.length ; row++){
        finalMap.push([]);
        floorsMap.push([]);

        matrix[row][col] = parseInt(matrix[row][col]);

        for(col = 0 ; col < matrix[row].length ; col++){
            finalMap[row].push(matrix[row][col]);

            // Probabilistic wall, let's decide now
            if(matrix[row][col] == PROBABLE_TILE_ID){
                finalMap[row][col] = rand() < PROBABLE_TILE_PROBABILITY ? 1 : 0;
            }

            // Detect floors and ceilings to add spikes, spawn and exit
            if(row > 0){
                if(finalMap[row][col] == TILE_ID && finalMap[row - 1][col] == VOID_ID){
                    var f = [row, col];
                    floors.push(f);
                    floorsMap[row].push(f);
                }

                if(finalMap[row][col] == VOID_ID && finalMap[row - 1][col] == TILE_ID){
                    ceilings.push([row - 1, col]);
                }
            }
        }
    }

    // Add a random spawn and a random exit
    var potentialSpawns = flatten(floorsMap.slice(0, MASK_ROWS));
    var potentialExits = flatten(floorsMap.slice(finalMap.length - MASK_ROWS));

    var spawn = pick(potentialSpawns);
    var exit = pick(potentialExits);

    finalMap[spawn[0] - 1][spawn[1]] = SPAWN_ID;
    finalMap[exit[0] - 1][exit[1]] = EXIT_ID;
    finalMap[exit[0]][exit[1]] = UNBREAKABLE_TILE_ID;

    // Add random spikes
    floors.forEach(function(f){
        if(f != exit && f != spawn && rand() < SPIKE_DENSITY){
            finalMap[f[0]][f[1]] = FLOOR_SPIKE_ID;
        }
    });

    ceilings.forEach(function(c){
        if(c != exit && c != spawn && rand() < SPIKE_DENSITY){
            finalMap[c[0]][c[1]] = CEILING_SPIKE_ID;
        }
    });

    return pad(finalMap, WORLD_PADDING);
}
