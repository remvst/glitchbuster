var codePattern = cachePattern(400, 400, function(r){
    var lines = Character.toString().split(';').slice(0, 20),
        step = 400 / lines.length,
        y = step / 2;

    r.fillStyle = '#000';
    r.fillRect(0, 0, 400, 400);

    r.fillStyle = '#fff';
    r.globalAlpha = 0.1;
    r.font = '14pt Courier New';

    lines.forEach(function(l, i){
        r.fillText(l, 0, y);

        y += step;
    });
});
