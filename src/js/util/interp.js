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

var ts = [];

function interp(o, p, a, b, d, l, f, e){
    ts.push({
        o: o, // object
        p: p, // property
        a: a, // from
        b: b, // to
        d: d, // duration
        l: l || 0, // delay
        f: f || linear, // easing function
        e: e, // end callback
        t: 0
    });
}

function interpCycle(e){
    for(var i = ts.length - 1 ; i >= 0 ; i--){
        var tw = ts[i];
        if(tw.l > 0){
            tw.l -= e;
            tw.o[tw.p] = tw.a;
        }else{
            tw.t = min(tw.d, tw.t + e);
            tw.o[tw.p] = tw.f(tw.t, tw.a, tw.b - tw.a, tw.d);
            if(tw.t == tw.d){
                tw.e && tw.e();
                ts.splice(i, 1);
            }
        }
    }
}
