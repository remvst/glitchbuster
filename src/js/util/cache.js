function cache(w, h, f){
    var c = D.createElement('canvas');
    c.width = w;
    c.height = h;

    var r = c.getContext('2d');

    (f.call ? f : shape.bind(null, r, f))(r, c);

    return c;
}

function cachePattern(w, h, f){
    var c = cache(w, h, f);
    return c.getContext('2d').createPattern(c, 'repeat');
}
