function reevalControls(e){
    P.direction = 0;
    if(K[37]){
        P.direction = -1;
    }
    if(K[39]){
        P.direction = 1;
    }
}

onkeydown = function(e){
    if(!K[38] && e.keyCode == 38){
        P.jump(1);
    }

    if(!K[32] && e.keyCode == 32){
        P.throwGrenade();
    }

    K[e.keyCode] = true;
    reevalControls(e);
};

onkeyup = function(e){
    K[e.keyCode] = false;
    reevalControls(e);
};

var touch = function(e){
    e.preventDefault();

    P.direction = 0;

    var rect = C.getBoundingClientRect();
    for(var i = 0 ; i < e.touches.length ; i++){
        var x = CANVAS_WIDTH * (e.touches[i].pageX - rect.left) / rect.width,
            col = ~~(x / (CANVAS_WIDTH / 4));

        if(!col){
            P.direction = -1;
        }else if(col == 1){
            P.direction = 1;
        }else if(col == 2){
            P.throwGrenade();
        }else if(col == 3){
            P.jump(1);
        }
    }
};

addEventListener('touchstart', touch);
addEventListener('touchmove', touch);
addEventListener('touchend', touch);
