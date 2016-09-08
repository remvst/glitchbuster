function sliceGlitch(){
    var sh = CANVAS_HEIGHT / 10;

    drawImage(cache(CANVAS_WIDTH, CANVAS_HEIGHT, function(r){
        for(var y = 0 ; y < CANVAS_HEIGHT ; y += sh){
            r.drawImage(
                C,
                0, y, CANVAS_WIDTH, sh,
                rand(-100, 100), y, CANVAS_WIDTH, sh
            );
        }
    }), 0, 0);
}
