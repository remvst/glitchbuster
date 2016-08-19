function particle(s, c, as, numeric){
    var p, n = pick([0, 1]);

    // Add to the list of particles
    G.renderables.push(p = {
        s: s,
        c: c,
        render: function(){
            R.fillStyle = p.c;
            numeric ? fillText(n.toString(), p.x, p.y):fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
        }
    });

    // Interpolations
    as.forEach(function(a, id){
        var args = [p].concat(a);

        // Add the remove callback
        if(id === 0){
            args[7] = function(){
                remove(G.renderables, p);
            };
        }

        // Apply the interpolation
        interp.apply(0, args);
    });
}
