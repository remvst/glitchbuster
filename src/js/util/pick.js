function pick(choices, results, forceArray){
    choices = choices.slice(0);
    results = results || 1;

    var res = [];

    while(res.length < results){
        res = res.concat(
            choices.splice(~~(random() * choices.length), 1) // returns the array of deleted elements
        );
    }

    return results === 1 && !forceArray ? res[0] : res;
}
