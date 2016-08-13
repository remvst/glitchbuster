var ps = [];

function particle(s, c, as){
    var p;

    // Add to the list of particles
    ps.push(p = {
        s: s,
        c: c
    });

    // Interpolations
    as.forEach(function(a, id){
        var args = [p].concat(a);

        // Add the remove callback
        if(id === 0){
            args[7] = function(){
                var i = ps.indexOf(p);
                if(i >= 0){
                    ps.splice(i, 1);
                }
            };
        }

        // Apply the interpolation
        interp.apply(0, args);
    });
}

function renderParticles(){
    for(var i in ps){
        var p = ps[i];
        R.fillStyle = p.c;
        fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
    }
}
