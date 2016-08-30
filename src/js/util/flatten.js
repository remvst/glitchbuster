function flatten(m){
    var flattened = [];
    m.forEach(function(row){
        flattened = flattened.concat(row);
    });
    return flattened;
}
