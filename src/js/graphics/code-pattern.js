var codePattern = cachePattern(400, 400, function(r){
    var lines = Character.toString().split(';').slice(0, 20),
        step = 400 / lines.length,
        y = step / 2;

    with(r){
        fillStyle = '#000';
        fillRect(0, 0, 400, 400);

        fillStyle = '#fff';
        globalAlpha = 0.1;
        font = '14pt Courier New';

        lines.forEach(function(l, i){
            fillText(l, 0, y);

            y += step;
        });
    }
});
