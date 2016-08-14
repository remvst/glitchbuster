function particle(s, c, as){
    var p;

    // Add to the list of particles
    W.renderables.push(p = {
        s: s,
        c: c,
        render: function(){
            R.fillStyle = p.c;
            fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
        }
    });

    // Interpolations
    as.forEach(function(a, id){
        var args = [p].concat(a);

        // Add the remove callback
        if(id === 0){
            args[7] = function(){
                remove(W.renderables, p);
            };
        }

        // Apply the interpolation
        interp.apply(0, args);
    });
}
