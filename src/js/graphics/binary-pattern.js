var binaryPatterns = [];

for(var i = 0 ; i < 5 ; i++){
    binaryPatterns.push(cachePattern(TILE_SIZE * 2, TILE_SIZE * 2, function(r){
        with(r){
            fillStyle = '#000';
            fillRect(0, 0, c.width, c.height);

            fillStyle = '#fff';
            font = '14pt Courier Sans';
            textAlign = 'center';

            var alphabet = '证件驾照护照及出入境记录身份证'.split('');
            var alphabet = '01'.split('');

            var stepX = c.width / 10,
                stepY = c.height / 10;
            for(var x = stepX / 2 ; x < c.width ; x += stepX){
                for(var y = stepY / 2 ; y < c.height ; y += stepY){
                    fillText(pick(alphabet), x, y);
                }
            }
        }
    }));
}
