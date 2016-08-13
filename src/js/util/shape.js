function shape(c, x){
    for(var i in x){
        var p = x[i].slice(1);
        switch(x[i][0]){
            case FILLSTYLE:
                c.fillStyle = x[i][1];
                break;
            case FILLRECT:
                c.fillRect.apply(c, p);
                break;
            case DRAWIMAGE:
                c.drawImage.apply(c, p);
                break;
        }
    }
}
