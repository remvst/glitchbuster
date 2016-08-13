function renderWorld(){
    R.fillStyle = G.globalPattern || '#fff';
    R.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    R.save();

    if(G.invert){
        R.translate(0, CANVAS_HEIGHT);
        R.scale(1, -1);
    }

    R.translate(-V.x, -V.y);

    /*for(var row = 0 ; row < W.tiles.length ; row++){
        for(var col = 0 ; col < W.tiles[row].length ; col++){
            if(W.tiles[row][col]){
                W.tiles[row][col].render();
            }
        }
    }*/

    R.fillStyle = '#000';
    R.fillRect(0, 0, W.cols * TILE_SIZE, W.rows * TILE_SIZE);

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

    var haloX = ~~P.x - DARK_HALO_SIZE_HALF,
        haloY = ~~P.y - DARK_HALO_SIZE_HALF,
        haloX2 = haloX + DARK_HALO_SIZE,
        haloY2 = haloY + DARK_HALO_SIZE;

    R.fillStyle = '#000';
    if(haloX > V.x){
        R.fillRect(V.x, haloY, haloX - V.x, DARK_HALO_SIZE);
    }
    if(haloX2 < cameraRightX){
        R.fillRect(haloX2, haloY, cameraRightX - haloX2, DARK_HALO_SIZE);
    }
    if(haloY > V.y){
        R.fillRect(V.x, V.y, CANVAS_WIDTH, haloY - V.y);
    }
    if(haloY2 < cameraBottomY){
        R.fillRect(V.x, haloY2, CANVAS_WIDTH, cameraBottomY - haloY2);
    }

    R.drawImage(darkHalo, haloX, haloY);

    renderParticles();

    R.restore();
}
