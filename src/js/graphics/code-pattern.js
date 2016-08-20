var codePattern = cachePattern(400, 400, function(c, r){
    var lines = Character.toString().split(';').slice(0, 20),
        step = c.height / lines.length,
        y = step / 2;

    r.fillStyle = '#000';
    r.fillRect(0, 0, c.width, c.height);

    r.fillStyle = '#fff';
    r.globalAlpha = 0.1;
    r.font = '14pt Courier New';
    r.textBaseline = 'middle';

    lines.forEach(function(l, i){
        r.fillText(l, 0, y);

        y += step;
    });
});
