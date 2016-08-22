function progressString(c, p, n){
    var s = '';
    for(var i = 0 ; i < n ; i++){
        s += i < p ? c : '-';
    }
    return s;
}
