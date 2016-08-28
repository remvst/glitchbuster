var defs = {
    a: matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ]),
    b: matrix([
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,1,1]
    ]),
    c: matrix([
        [1,1,1],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ]),
    d: matrix([
        [1,1,0],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    e: matrix([
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,0],
        [1,1,1]
    ]),
    f: matrix([
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [1,0,0],
        [1,0,0]
    ]),
    g: matrix([
        [1,1,1],
        [1,0,0],
        [1,0,0],
        [1,0,1],
        [1,1,1]
    ]),
    h: matrix([
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1]
    ]),
    i: matrix([
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ]),
    /*j: [
        [0,0,1],
        [0,0,1],
        [0,0,1],
        [1,0,1],
        [1,1,1]
    ],*/
    k: matrix([
        [1,0,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
    ]),
    l: matrix([
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,0,0],
        [1,1,1]
    ]),
    m: matrix([
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1]
    ]),
    n: matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1]
    ]),
    o: matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    p: matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,0],
        [1,0,0]
    ]),
    q: matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,0,1]
    ]),
    r: matrix([
        [1,1,1],
        [1,0,1],
        [1,1,0],
        [1,0,1],
        [1,0,1]
    ]),
    s: matrix([
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ]),
    t: matrix([
        [1,1,1],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ]),
    u: matrix([
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    v: matrix([
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [0,1,0]
    ]),
    w: matrix([
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [0,1,0,1,0]
    ]),
    x: matrix([
        [1,0,1],
        [1,0,1],
        [0,1,0],
        [1,0,1],
        [1,0,1]
    ]),
    y: matrix([
        [1,0,1],
        [1,0,1],
        [1,1,1],
        [0,1,0],
        [0,1,0]
    ]),
    /*'\'': matrix([
        [1]
    ]),*/
    /*'.': matrix([
        [0],
        [0],
        [0],
        [0],
        [1]
    ]),*/
    ' ': matrix([
        [0,0],
        [0,0],
        [0,0],
        [0,0],
        [0,0]
    ]),
    '-': [
        [0,0],
        [0,0],
        [1,1],
        [0,0],
        [0,0]
    ],
    ':': matrix([
        [0],
        [1],
        [ ],
        [1],
        [ ]
    ]),
    '?': matrix([
        [1,1,1],
        [1,1,1],
        [1,1,1],
        [1,1,1],
        [1,1,1]
    ]),
    '!': matrix([
        [0,1,0,1,0],
        [1,1,1,1,1],
        [1,1,1,1,1],
        [0,1,1,1,0],
        [0,0,1,0,0]
    ]),
    '/': matrix([
        [0,0,1],
        [0,0,1],
        [0,1,0],
        [1,0,0],
        [1,0,0]
    ]),
    '1': matrix([
        [1,1,0],
        [0,1,0],
        [0,1,0],
        [0,1,0],
        [1,1,1]
    ]),
    '2': matrix([
        [1,1,1],
        [0,0,1],
        [1,1,1],
        [1,0,0],
        [1,1,1]
    ]),
    '3': matrix([
        [1,1,1],
        [0,0,1],
        [0,1,1],
        [0,0,1],
        [1,1,1]
    ]),
    '4': matrix([
        [1,0,0],
        [1,0,0],
        [1,0,1],
        [1,1,1],
        [0,0,1]
    ]),
    '5': matrix([
        [1,1,1],
        [1,0,0],
        [1,1,0],
        [0,0,1],
        [1,1,0]
    ]),
    '6': matrix([
        [1,1,1],
        [1,0,0],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ]),
    '7': matrix([
        [1,1,1],
        [0,0,1],
        [0,1,0],
        [0,1,0],
        [0,1,0]
    ]),
    '8': matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ]),
    '9': matrix([
        [1,1,1],
        [1,0,1],
        [1,1,1],
        [0,0,1],
        [1,1,1]
    ]),
    '0': matrix([
        [1,1,1],
        [1,0,1],
        [1,0,1],
        [1,0,1],
        [1,1,1]
    ]),
    '(': matrix([
        [0,1],
        [1],
        [1],
        [1],
        [0,1]
    ]),
    ')': matrix([
        [1, 0],
        [0, 1],
        [0, 1],
        [0, 1],
        [1]
    ])
};

if(DEBUG){
    (function(){
        used = {};
        for(var i in defs){
            used[i] = false;
        }

        window.checkUsed = function(){
            var unused = [];
            for(var i in used){
                if(!used[i]){
                    unused.push(i);
                }
            }
            return unused.sort();
        };
    })();
}

function drawText(r, t, x, y, s, c){
    for(var i = 0 ; i < t.length ; i++){
        if(DEBUG){
            used[t.charAt(i)] = true;
        }

        var cached = cachedCharacter(t.charAt(i), s, c);

        r.drawImage(cached, x, y);

        x += cached.width + s;
    }
}

var cachedTexts = {};
function drawCachedText(r, t, x, y, s, c){
    var key = t + s + c;
    if(!cachedTexts[key]){
        cachedTexts[key] = cache(s * requiredCells(t, s), s * 5, function(r){
            drawText(r, t, 0, 0, s, c);
        });
    }
    r.drawImage(cachedTexts[key], x, y);
}

function requiredCells(t, s){
    var r = 0;
    for(var i = 0 ; i < t.length ; i++){
        r += defs[t.charAt(i)][0].length + 1;
    }
    return r - 1;
}

var cachedChars = {};
function cachedCharacter(t, s, c){
    var key = t + s + c;
    if(!cachedChars[key]){
        var def = defs[t];
        cachedChars[key] = cache(def[0].length * s, def.length * s, function(r){
            r.fillStyle = c;
            for(var row = 0 ; row < def.length ; row++){
                for(var col = 0 ; col < def[row].length ; col++){
                    if(def[row][col]){
                        r.fillRect(col * s, row * s, s, s);
                    }
                }
            }
        });
    }
    return cachedChars[key];
}

function button(t, w){
    w = w || 440;
    return cache(w, 100, function(r){
        with(r){
            fillStyle = '#444';
            fillRect(0, 90, w, 10);

            fillStyle = '#fff';
            fillRect(0, 0, w, 90);

            drawText(r, '::' + t + '()', 100, 20, 10, '#000');

            fillStyle = '#000';
            beginPath();
            moveTo(40, 20);
            lineTo(80, 45);
            lineTo(40, 70);
            fill();
        }
    });
}
