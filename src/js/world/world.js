function World(matrix){
    this.tiles = [];
    this.matrix = matrix;

    this.rows = matrix.length;
    this.cols = matrix[0].length;

    for(var row = 0 ; row < matrix.length ; row++){
        this.tiles.push([]);
        for(var col = 0 ; col < matrix[row].length ; col++){
            this.tiles[row][col] = null;
            if(matrix[row][col] > 0){
                this.tiles[row][col] = new Tile(row, col, matrix[row][col]);

                if(matrix[row][col] == SPAWN_ID){
                    this.spawn = this.tiles[row][col];
                }else if(matrix[row][col] == EXIT_ID){
                    this.exit = this.tiles[row][col];
                }
            }
        }
    }

    this.tileAt = function(x, y){
        var row = ~~(y / TILE_SIZE);
        var t = this.tiles[row] && this.tiles[row][~~(x / TILE_SIZE)];
        return t && t.solid && t;
    };

    this.destroyTile = function(tile){
        if(tile && tile.type != UNBREAKABLE_TILE_ID){
            for(var i = 0 ; i < 50 ; i++){
                var d = rand(0.5, 2),
                    x = tile.x + rand(TILE_SIZE);

                particle(4, '#fff', [
                    ['x', x, x, d],
                    ['y', tile.y + rand(TILE_SIZE), this.firstYUnder(x, tile.center.y), d, 0, easeOutBounce],
                    ['s', 12, 0, d]
                ]);
            }

            tile.destroyed = true;
            this.tiles[tile.row][tile.col] = null;
        }
    };

    this.destroyTileAt = function(x, y){
        this.destroyTile(this.tileAt(x, y));
    };

    this.detectPaths = function(l){
        var colCount = 0,
            paths = [];
        for(var row = 0 ; row < this.rows - 1 ; row++){ // skip the last row
            colCount = 0;
            for(var col = 0 ; col < this.cols ; col++){
                var current = this.matrix[row][col] != VOID_ID;
                var below = this.matrix[row + 1][col] == TILE_ID || this.matrix[row + 1][col] == UNBREAKABLE_TILE_ID;

                if(!below || current){
                    if(colCount >= l){
                        paths.push({
                            row: row,
                            colLeft: col - colCount,
                            colRight: col - 1
                        });
                    }
                    colCount = 0;
                }else{
                    colCount++;
                }
            }
        }
        return paths;
    };

    this.firstYUnder = function(x, y){
        do{
            y += TILE_SIZE;
        }while(y < this.rows * TILE_SIZE && !this.tileAt(x, y));

        return ~~(y / TILE_SIZE) * TILE_SIZE;
    };

    this.render = function(){
        R.fillStyle = G.hideTiles || shittyMode ? '#000' : '#fff';
        fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        save();

        /*if(G.invert){
            translate(0, CANVAS_HEIGHT);
            scale(1, -1);
        }*/

        translate(-V.x, -V.y);

        R.fillStyle = shittyMode ? '#000' : codePattern;
        fillRect(0, 0, this.cols * TILE_SIZE, this.rows * TILE_SIZE);

        var cameraRightX = V.x + CANVAS_WIDTH,
            cameraBottomY = V.y + CANVAS_HEIGHT;

        for(var row = ~~(V.y / TILE_SIZE) ; row <  ~~(cameraBottomY / TILE_SIZE) + 1 ; row++){
            for(var col = ~~(V.x / TILE_SIZE) ; col <  ~~(cameraRightX / TILE_SIZE) + 1 ; col++){
                if(this.tiles[row] && this.tiles[row][col]){
                    this.tiles[row][col].render();
                }
            }
        }

        P.render();

        for(var i in G.renderables){
            G.renderables[i].render();
        }

        if(!shittyMode){
            var px = P.x,
                py = P.y + (P.lookingDown ? 200 : 0);

            px = V.x + CANVAS_WIDTH / 2;
            py = V.y + CANVAS_HEIGHT / 2;
            var haloX = ~~px - DARK_HALO_SIZE_HALF,
                haloY = ~~py - DARK_HALO_SIZE_HALF,
                haloX2 = haloX + DARK_HALO_SIZE,
                haloY2 = haloY + DARK_HALO_SIZE;

            R.fillStyle = '#000';
            if(haloX > V.x){
                fillRect(V.x, haloY, haloX - V.x, DARK_HALO_SIZE);
            }
            if(haloX2 < cameraRightX){
                fillRect(haloX2, haloY, cameraRightX - haloX2, DARK_HALO_SIZE);
            }
            if(haloY > V.y){
                fillRect(V.x, V.y, CANVAS_WIDTH, haloY - V.y);
            }
            if(haloY2 < cameraBottomY){
                fillRect(V.x, haloY2, CANVAS_WIDTH, cameraBottomY - haloY2);
            }

            drawImage(darkHalo, haloX, haloY);
        }

        restore();
    };
}
