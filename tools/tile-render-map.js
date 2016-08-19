

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
        // Ceiling spikes
        ctx.fillStyle = '#fff';
        ctx.fillRect(col * s, row * s, s, s);

        ctx.fillStyle = '#f00';
        ctx.fillRect(col * s, (row + 0.75) * s, s, s * 0.25);
    },
    '7': function(ctx, row, col, s){
        // Floor spikes
        ctx.fillStyle = '#fff';
        ctx.fillRect(col * s, row * s, s, s);

        ctx.fillStyle = '#f00';
        ctx.fillRect(col * s, row * s, s, s * 0.25);
    }
};
