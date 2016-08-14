// Remove an element from an array
function remove(l, e){
    var i = l.indexOf(e);
    if(i >= 0) l.splice(i, 1);
}
