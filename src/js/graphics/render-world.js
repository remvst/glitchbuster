function renderWorld(){
    R.fillStyle = '#fff';
    fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    save();

    if(G.invert){
        translate(0, CANVAS_HEIGHT);
        scale(1, -1);
    }

    translate(-V.x, -V.y);

    R.fillStyle = '#000';
    fillRect(0, 0, W.cols * TILE_SIZE, W.rows * TILE_SIZE);

    var cameraRightX = V.x + CANVAS_WIDTH,
        cameraBottomY = V.y + CANVAS_HEIGHT;

    for(var row = ~~(V.y / TILE_SIZE) ; row <  ~~(cameraBottomY / TILE_SIZE) + 1 ; row++){
        for(var col = ~~(V.x / TILE_SIZE) ; col <  ~~(cameraRightX / TILE_SIZE) + 1 ; col++){
            W.tiles[row] && W.tiles[row][col] && W.tiles[row][col].render();
        }
    }

    P.render();

    for(var i in W.enemies){
        W.enemies[i].render();
    }

    for(var i in W.grenades){
        W.grenades[i].render();
    }

    renderParticles();

    var haloX = ~~P.x - DARK_HALO_SIZE_HALF,
        haloY = ~~P.y - DARK_HALO_SIZE_HALF,
        haloX2 = haloX + DARK_HALO_SIZE,
        haloY2 = haloY + DARK_HALO_SIZE;

    R.fillStyle = '#000';
    if(haloX > V.x){
        fillRect(V.x, haloY, haloX - V.x, DARK_HALO_SIZE);
    }
    if(haloX2 < cameraRightX){
        fillRect(haloX2, haloY, cameraRightX - haloX2, DARK_HALO_SIZE);
    }
    if(haloY > V.y){
        fillRect(V.x, V.y, CANVAS_WIDTH, haloY - V.y);
    }
    if(haloY2 < cameraBottomY){
        fillRect(V.x, haloY2, CANVAS_WIDTH, cameraBottomY - haloY2);
    }

    drawImage(darkHalo, haloX, haloY);

    restore();
}
