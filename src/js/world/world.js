function World(map){
    this.enemies = [];
    this.grenades = [];
    this.tiles = [];
    this.map = map;

    this.rows = map.length;
    this.cols = map[0].length;

    for(var row = 0 ; row < map.length ; row++){
        this.tiles.push([]);
        for(var col = 0 ; col < map[row].length ; col++){
            this.tiles[row][col] = null;
            if(map[row][col] > 0){
                this.tiles[row][col] = new Tile(row, col, map[row][col]);

                if(map[row][col] == SPAWN_ID){
                    this.spawn = this.tiles[row][col];
                }else if(map[row][col] == EXIT_ID){
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
                    ['y', tile.y + rand(TILE_SIZE), tile.y + TILE_SIZE, d, 0, easeOutBounce],
                    ['s', 15, 0, d]
                ]);
            }

            this.tiles[tile.row][tile.col] = null;
        }
    };

    this.destroyTileAt = function(row, col){
        this.destroyTile(this.tiles[row] && this.tiles[row][col]);
    };

    this.detectPaths = function(l){
        var colCount = 0,
            paths = [];
        for(var row = 0 ; row < this.rows - 1 ; row++){ // skip the last row
            colCount = 0;
            for(var col = 0 ; col < this.cols ; col++){
                var current = this.map[row][col] != VOID_ID;
                var below = this.map[row + 1][col] == TILE_ID || this.map[row + 1][col] == UNBREAKABLE_TILE_ID;

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
}
