function sliceGlitch(){
    var sh = CANVAS_HEIGHT / 10;

    drawImage(cache(CANVAS_WIDTH, CANVAS_HEIGHT, function(c, r){
        for(var y = 0 ; y < CANVAS_HEIGHT ; y += sh){
            r.drawImage(
                C,
                0, y, C.width, sh,
                rand(-100, 100), y, C.width, sh
            );
        }
    }), 0, 0);
}
