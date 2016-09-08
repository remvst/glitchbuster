function addZeros(n, l){
    n = '' + n;
    while(n.length < l){
        n = '0' + n;
    }
    return n;
}

function formatTime(t, ms){
    var m = ~~(t / 60),
        s = ~~(t % 60);

    return addZeros(m, 2) + ':' + addZeros(s, 2) + (ms ? '.' + addZeros(~~(t % 1 * 100), 2) : '');
}
