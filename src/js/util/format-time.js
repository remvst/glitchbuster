function formatTime(t){
    var m = ~~(t / 60),
        s = ~~(t % 60);

    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}
