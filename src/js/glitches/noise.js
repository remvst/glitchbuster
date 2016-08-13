function noiseGlitch(){
    R.fillStyle = noisePattern;

    var x = ~~rand(-NOISE_PATTERN_SIZE, NOISE_PATTERN_SIZE),
        y = ~~rand(-NOISE_PATTERN_SIZE, NOISE_PATTERN_SIZE);

    save();
    translate(x, y);
    R.globalAlpha = rand(0.5);
    fillRect(-x, -y, CANVAS_WIDTH, CANVAS_HEIGHT);
    restore();
}
