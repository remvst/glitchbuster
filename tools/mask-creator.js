var P = {
    width: 400,
    height: 400,
    gridRows: 10,
    gridCols: 10,
    cellSize: 40
};

window.addEventListener('load', function(){
    var textArea = document.querySelector('textarea');

    var can = document.querySelector('canvas');
    can.width = P.width;
    can.height = P.height;

    var ctx = can.getContext('2d');

    var mask = [
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
    ];

    var tileRenderMap = {
        '0': function(){

        },
        '1': function(row, col){
            // Tile
            ctx.fillStyle = '#fff';
            ctx.fillRect(col * P.cellSize, row * P.cellSize, P.cellSize, P.cellSize);
        },
        '2': function(row, col){
            // Unbreakable tile
            ctx.fillStyle = '#f00';
            ctx.fillRect(col * P.cellSize, row * P.cellSize, P.cellSize, P.cellSize);
        },
        '3': function(row, col){
            // Probable tile
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#fff';
            ctx.fillRect(col * P.cellSize, row * P.cellSize, P.cellSize, P.cellSize);
            ctx.globalAlpha = 1;
        }
    };

    function render(){
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, P.width, P.height);

        ctx.fillStyle = '#fff';
        for(var row = 0 ; row < P.gridRows ; row++){
            for(var col = 0 ; col < P.gridCols ; col++){
                tileRenderMap[mask[row][col]](row, col);
            }
        }

        ctx.fillStyle = '#f00';
        for(var col = 0 ; col < P.gridCols ; col++){
            ctx.fillRect(col * P.cellSize, 0, 1, P.height);
        }
        for(var row = 0 ; row < P.gridRows ; row++){
            ctx.fillRect(0, row * P.cellSize, P.width, 1);
        }
    }

    function updateTextArea(){
        textArea.value = '[\n' + mask.map(function(row){
            return '    [' + row.join(',') + ']';
        }).join(',\n') + '\n]';
    }

    render();

    function mouseEvent(e){
        e.preventDefault();

        var rect = can.getBoundingClientRect();

        var canX = e.pageX - rect.left;
        var canY = e.pageY - rect.top;

        var col = ~~(canX / P.cellSize);
        var row = ~~(canY / P.cellSize);

        var diff = e.which === 1 ? 1 : -1;

        //while(mask[row][col] === 2){
            mask[row][col] = (mask[row][col] + diff + 4) % 4;
        //}

        render();
        updateTextArea();
    }

    can.addEventListener('mousedown', mouseEvent, false);
    can.addEventListener('contextmenu', function(e){
        e.preventDefault();
    }, false);

    textArea.addEventListener('keyup', function(){
        try{
            mask = JSON.parse(this.value);
        }catch(e){
            console.error(e);
        }

        render();
    });
}, false);
