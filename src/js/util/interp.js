function linear(t, b, c, d){
    return (t / d) * c + b;
}

function easeOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

function oscillate(t, b, c, d) {
    return sin((t / d) * PI * 2 * 2) * c + b;
}

function easeOutBounce(t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
}

function interp(o, p, a, b, d, l, f, e){
    G.cyclables.push({
        o: o, // object
        p: p, // property
        a: a, // from
        b: b, // to
        d: d, // duration
        l: l || 0, // delay
        f: f || linear, // easing function
        e: e, // end callback
        t: 0,
        cycle: function(e){
            if(this.l > 0){
                this.l -= e;
                this.o[this.p] = this.a;
            }else{
                this.t = min(this.d, this.t + e);
                this.o[this.p] = this.f(this.t, this.a, this.b - this.a, this.d);
                if(this.t == this.d){
                    this.e && this.e();
                    remove(G.cyclables, this);
                }
            }
        }
    });
}
