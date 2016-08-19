var P = {
    width: 800,
    height: 800,
    gridRows: 80,
    gridCols: 80,
    cellSize: 10
};

window.addEventListener('load', function(){
    var textArea = document.querySelector('textarea');

    var can = document.querySelector('canvas');
    can.width = P.width;
    can.height = P.height;

    var ctx = can.getContext('2d');

    var level = tutorialLevel;

    function extendLevel(rows, cols){
        for(var row = level.length ; row < rows ; row++){
            level.push([]);
            for(var col = level[row].length ; col < cols ; col++){
                level[row].push(VOID_ID);
            }
        }
    }

    function renderGrid(grid, ctx, s){
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, grid[0].length * s, grid.length * s);

        // Render the tiles
        for(var row = 0 ; row < grid.length ; row++){
            for(var col = 0 ; col < grid[0].length ; col++){
                tileRenderMap[grid[row][col]](ctx, row, col, s);
            }
        }

        // Render a grid
        ctx.fillStyle = '#f00';
        for(var col = 0 ; col < grid[0].length ; col++){
            ctx.fillRect(col * s, 0, 1, grid.length * s);
        }
        for(var row = 0 ; row < grid.length ; row++){
            ctx.fillRect(0, row * s, grid[0].length * s, 1);
        }
    }

    function render(){
        renderGrid(level, ctx, P.cellSize);
    }

    function updateUI(){
        textArea.value = '[\n' + minifiedLevel(level).map(function(xs){
            return '    [' + xs.join(', ') + ']';
        }).join(',\n') + '\n]';
    }

    function mouseEvent(e){
        e.preventDefault();

        var rect = can.getBoundingClientRect();

        var canX = e.pageX - rect.left;
        var canY = e.pageY - rect.top;

        var col = ~~(canX / P.cellSize);
        var row = ~~(canY / P.cellSize);

        var diff = e.which === 1 ? 1 : -1;

        level[row][col] = (level[row][col] + diff + 8) % 8;

        render();
        updateUI();
    }

    can.addEventListener('mousedown', mouseEvent, false);
    can.addEventListener('contextmenu', function(e){
        e.preventDefault();
    }, false);

    textArea.addEventListener('keyup', function(){
        try{
            level = eval(this.value);
        }catch(e){
            console.error(e);
        }

        render();
    });

    function minifiedLevel(){
        var copy = JSON.parse(JSON.stringify(level));

        var minRow = null;
        var maxRow = 0;
        for(var row = 0 ; row < level.length ; row++){
            var used = level[row].filter(function(x){
                return x > 0;
            }).length > 0;

            if(used){
                if(minRow === null){
                    minRow = row;
                }
                maxRow = row;
            }
        }

        copy = copy.slice(minRow, maxRow + 1);

        return copy;
    }

    extendLevel(P.gridRows, P.gridCols);
    render();
    updateUI();
}, false);
