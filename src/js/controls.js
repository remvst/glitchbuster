function reevalControls(e){
    P.direction = 0;
    if(K[37]){
        P.direction = -1;
    }
    if(K[39]){
        P.direction = 1;
    }
}

addEventListener('keydown', function(e){
    if(!K[38] && e.keyCode == 38){
        P.jump(1);
    }

    K[e.keyCode] = true;
    reevalControls(e);
}, false);

addEventListener('keyup', function(e){
    K[e.keyCode] = false;
    reevalControls(e);
}, false);
