function sliceGlitch(){
    var sh = C.height / 10;

    drawImage(cache(C.width, C.height, function(r){
        for(var y = 0 ; y < CANVAS_HEIGHT ; y += sh){
            r.drawImage(
                C,
                0, y, C.width, sh,
                rand(-100, 100), y, C.width, sh
            );
        }
    }), 0, 0);
}
