var P = {
    width: 400,
    height: 400,
    gridRows: 10,
    gridCols: 10,
    cellSize: 40,
    simulationCellSize: 10
};

function maskMap(){
    var map = {};

    var allMasks = masks.concat(masks.map(mirrorMask));
    allMasks.forEach(function(mask){
        map[mask.exits] = map[mask.exits] || 0;
        map[mask.exits]++;
    });
    return map;
}

console.log(maskMap());

window.addEventListener('load', function(){
    var textArea = document.querySelector('textarea');

    var can = document.querySelector('canvas');
    can.width = P.width;
    can.height = P.height;

    var select = document.querySelector('select');
    document.querySelector('#add').onclick = function(){
        masks.push({
            'mask': [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            ],
            'exits': []
        });

        updateUI();
    };

    document.querySelector('#delete').onclick = function(){
        masks.splice(currentMaskId, 1);

        currentMaskId--;
        updateUI();
        render();
    };

    document.querySelector('#simulate').onclick = function(){
        var w = generateWorld(12);

        var can = document.querySelector('#simulation-canvas');
        can.width = w[0].length * P.simulationCellSize;
        can.height = w.length * P.simulationCellSize;

        var c = can.getContext('2d');

        renderGrid(w, c, P.simulationCellSize);
    };

    var leftCB = document.querySelector('#left');
    var rightCB = document.querySelector('#right');
    var upCB = document.querySelector('#up');
    var downCB = document.querySelector('#down');

    downCB.onchange = rightCB.onchange = upCB.onchange = leftCB.onchange = function(){
        var mask = masks[currentMaskId];
        mask.exits = 0;

        if(leftCB.checked) mask.exits |= LEFT;
        if(rightCB.checked) mask.exits |= RIGHT;
        if(upCB.checked) mask.exits |= UP;
        if(downCB.checked) mask.exits |= DOWN;

        updateUI();
    };

    var ctx = can.getContext('2d');

    var currentMaskId = 0;

    var tileRenderMap = {
        '0': function(){

        },
        '1': function(ctx, row, col, s){
            // Tile
            ctx.fillStyle = '#fff';
            ctx.fillRect(col * s, row * s, s, s);
        },
        '2': function(ctx, row, col, s){
            // Unbreakable tile
            ctx.fillStyle = '#f00';
            ctx.fillRect(col * s, row * s, s, s);
        },
        '3': function(ctx, row, col, s){
            // Probable tile
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#fff';
            ctx.fillRect(col * s, row * s, s, s);
            ctx.globalAlpha = 1;
        },
        '4': function(ctx, row, col, s){
            // Spawn
            ctx.fillStyle = 'blue';
            ctx.fillRect(col * s, row * s, s, s);
        },
        '5': function(ctx, row, col, s){
            // Exit
            ctx.fillStyle = 'blue';
            ctx.fillRect(col * s, row * s, s, s);
        },
        '6': function(ctx, row, col, s){
            // Floor spikes
            ctx.fillStyle = '#fff';
            ctx.fillRect(col * s, row * s, s, s);

            ctx.fillStyle = '#f00';
            ctx.fillRect(col * s, row * s, s, s * 0.25);
        },
        '7': function(ctx, row, col, s){
            // Ceiling spikes
            ctx.fillStyle = '#fff';
            ctx.fillRect(col * s, row * s, s, s);

            ctx.fillStyle = '#f00';
            ctx.fillRect(col * s, (row + 0.75) * s, s, s * 0.25);
        }
    };

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
        var mask = masks[currentMaskId].mask;
        renderGrid(mask, ctx, P.cellSize);
    }

    function updateUI(){
        textArea.value = JSON.stringify(masks, null, 4);

        textArea.value = '[' + masks.map(function(m){
            var exits = [];
            if(m.exits & RIGHT){
                exits.push('RIGHT');
            }
            if(m.exits & LEFT){
                exits.push('LEFT');
            }
            if(m.exits & DOWN){
                exits.push('DOWN');
            }
            if(m.exits & UP){
                exits.push('UP');
            }

            return '{\n' +
                '    "mask": matrix([\n' +
                    m.mask.map(function(row){
                        return '        [' + row.join(', ') + ']';
                    }).join(',\n') + '\n' +
                '    ]),\n' +
                '    "exits": evaluate(' + exits.sort().join(' | ') + ')\n' +
            '}';
        }).join(', ') + ']';

        select.innerHTML = '';
        for(var i = 0 ; i < masks.length ; i++){
            var option = document.createElement('option');
            option.setAttribute('data-mask-id', i);
            option.innerHTML = 'Mask #' + i;
            option.value = i;
            option.selected = (i == currentMaskId ? 'selected' : '');
            select.appendChild(option);
        }

        select.value = currentMaskId;

        var mask = masks[currentMaskId];

        rightCB.checked = mask.exits & RIGHT;
        leftCB.checked = mask.exits & LEFT;
        upCB.checked = mask.exits & UP;
        downCB.checked = mask.exits & DOWN;

        updatingUI = false;
    }

    select.onchange = function(){
        currentMaskId = parseInt(this.value);
        updateUI();
        render();
    };

    render();

    function mouseEvent(e){
        e.preventDefault();

        var rect = can.getBoundingClientRect();

        var canX = e.pageX - rect.left;
        var canY = e.pageY - rect.top;

        var col = ~~(canX / P.cellSize);
        var row = ~~(canY / P.cellSize);

        var diff = e.which === 1 ? 1 : -1;

        var mask = masks[currentMaskId].mask;
        mask[row][col] = (mask[row][col] + diff + 4) % 4;

        render();
        updateUI();
    }

    can.addEventListener('mousedown', mouseEvent, false);
    can.addEventListener('contextmenu', function(e){
        e.preventDefault();
    }, false);

    textArea.addEventListener('keyup', function(){
        try{
            masks = eval(this.value);
        }catch(e){
            console.error(e);
        }

        render();
    });

    updateUI();
}, false);
