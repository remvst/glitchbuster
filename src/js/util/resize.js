onresize = function(){
    T(function(){
        var maxWidth = innerWidth,
            maxHeight = innerHeight,

            availableRatio = maxWidth / maxHeight,
            baseRatio = CANVAS_WIDTH / CANVAS_HEIGHT,
            ratioDifference = abs(availableRatio - baseRatio),
            width,
            height,
            s = D.querySelector('#canvascontainer').style;

        if(availableRatio <= baseRatio){
            width = maxWidth;
            height = width / baseRatio;
        }else{
            height = maxHeight;
            width = height * baseRatio;
        }

        s.width = width + 'px';
        s.height = height + 'px';
    }, 100);
};
