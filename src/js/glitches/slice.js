function sliceGlitch(){
    var slices = 10,
        sliceHeight = CANVAS_HEIGHT / slices,
        c = document.createElement('canvas'),
        r = c.getContext('2d');

    c.width = CANVAS_WIDTH;
    c.height = CANVAS_HEIGHT;

    for(var y = 0 ; y < C.height ; y += sliceHeight){
        r.drawImage(
            C,
            0, y, C.width, sliceHeight,
            rand(-100, 100), y, C.width, sliceHeight
        );
    }

    R.drawImage(c, 0, 0);
}
