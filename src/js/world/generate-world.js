function pickMask(masks, requirements){
    return pick(masks.filter(function(m){
        return requirements.filter(function(req){
            return m.exits.indexOf(req) >= 0;
        }).length === requirements.length;
    }));
}


function generateWorld(id){
    if(id == 1){
        var m = matrix([
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, SPAWN_ID, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ]);
        for(var i = 0 ; i < 10 ; i++){
            m.push([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
        }

        return m.concat(matrix([
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, EXIT_ID, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, FLOOR_SPIKE_ID, 2, FLOOR_SPIKE_ID, 2, 2, 2, 2, 2]
        ]));
    }

    if(id == 2){
        var m = matrix([
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, SPAWN_ID, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ]);
        for(var i = 0 ; i < 10 ; i++){
            m.push([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
        }

        return m.concat(matrix([
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, EXIT_ID, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, FLOOR_SPIKE_ID, 2, FLOOR_SPIKE_ID, 2, 2, 2, 2, 2]
        ]));
    }

    if(id == 3){
        return matrix([
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2],
            [2, 0, SPAWN_ID, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, EXIT_ID, 0, 2],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ]);
    }


    var maskMapRows = 4,
        maskMapCols = 2,
        maskMap = [],
        downCol = -1,
        maskRows = 10,
        maskCols = 10,
        col,
        row;

    for(row = 0 ; row < maskMapRows ; row++){
        maskMap.push([]);

        for(col = 0 ; col < maskMapCols ; col++){
            maskMap[row][col] = [];
            col === downCol && maskMap[row][downCol].push(UP);
            col > 0 && maskMap[row][col].push(LEFT);
            col < maskMapCols - 1 && maskMap[row][col].push(RIGHT);
        }

        if(row < maskMapRows - 1){
            maskMap[row][downCol = ~~(rand() * maskMapCols)].push(DOWN);
        }
    }

    var map = [];

    for(row = 0 ; row < maskMapRows * maskRows + 2 ; row++){
        map[row] = [UNBREAKABLE_TILE_ID]; // left
        map[row][maskMapCols * maskCols + 1] = UNBREAKABLE_TILE_ID; // right
    }

    for(col = 0 ; col < maskMapCols * maskCols + 2 ; col++){
        map[0][col] = UNBREAKABLE_TILE_ID; // top
        map[map.length - 1][col] = UNBREAKABLE_TILE_ID; // bottom
    }

    for(row = 0 ; row < maskMapRows ; row++){
        for(col = 0 ; col < maskMapCols ; col++){

            var mask = pickMask(masks, maskMap[row][col]).mask;

            // Apply mask
            for(var maskRow = 0 ; maskRow < maskRows ; maskRow++){
                for(var maskCol = 0 ; maskCol < maskCols ; maskCol++){
                    map[row * maskRows + maskRow + 1][col * maskCols + maskCol + 1] = mask[maskRow][maskCol];
                }
            }
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

    finalMap[spawn[0] - 1][spawn[1]] = SPAWN_ID;
    finalMap[exit[0] - 1][exit[1]] = EXIT_ID;

    /*var s = '';
    for(var i = 0 ; i < map.length ; i++){
        for(var j = 0 ; j < map[i].length ; j++){
            s += finalMap[i][j] || ' ';
        }
        s += '\n';
    }*/

    return finalMap;
}
