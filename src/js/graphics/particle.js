function particle(s, c, as, numeric){
    var p, n = pick([0, 1]);

    // Add to the list of particles
    G.add(p = {
        s: s,
        c: c,
        render: function(){
            if(!V.contains(this.x, this.y, this.s)){
                return;
            }

            R.fillStyle = p.c;
            if(numeric){
                fillText(n.toString(), p.x, p.y);
            }else{
                fillRect(p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
            }
        }
    }, RENDERABLE);

    // Interpolations
    as.forEach(function(a, id){
        var args = [p].concat(a);

        // Add the remove callback
        if(!id){
            args[7] = function(){
                G.remove(p);
            };
        }

        // Apply the interpolation
        interp.apply(0, args);
    });
}
