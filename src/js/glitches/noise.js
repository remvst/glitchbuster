function noiseGlitch(){
    R.fillStyle = noisePattern;

    var x = ~~rand(-NOISE_PATTERN_SIZE, NOISE_PATTERN_SIZE),
        y = ~~rand(-NOISE_PATTERN_SIZE, NOISE_PATTERN_SIZE);

    R.save();
    R.translate(x, y);
    R.globalAlpha = rand(0.5);
    R.fillRect(-x, -y, CANVAS_WIDTH, CANVAS_HEIGHT);
    R.restore();
}
