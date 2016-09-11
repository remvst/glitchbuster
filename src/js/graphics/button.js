function button(t, end){
    return cache(440, 100, function(r){
        with(r){
            fillStyle = '#444';
            fillRect(0, 90, 440, 10);

            fillStyle = '#fff';
            fillRect(0, 0, 440, 90);

            drawText(r, '::' + t + (end || '()'), 100, 20, 10, '#000');

            fillStyle = '#000';
            beginPath();
            moveTo(40, 20);
            lineTo(80, 45);
            lineTo(40, 70);
            fill();
        }
    });
}
