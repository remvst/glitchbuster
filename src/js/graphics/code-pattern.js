var codePattern = cachePattern(400, 400, function(r){
    var y = evaluate(0.5 * 400 / 20);

    with(r){
        fillStyle = '#000';
        fillRect(0, 0, 400, 400);

        fillStyle = '#fff';
        globalAlpha = 0.1;
        font = '14pt Courier New';

        Character.toString().split(';').slice(0, 20).forEach(function(l){
            fillText(l, 0, y);

            y += evaluate(400 / 20);
        });
    }
});
