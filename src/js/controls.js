var touchButtons = {};

function reevalControls(e){
    P.direction = 0;
    if(K[37]){
        P.direction = -1;
    }
    if(K[39]){
        P.direction = 1;
    }
    P.lookingDown = K[40];
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

onclick = function(e){
    var rect = C.getBoundingClientRect();
    if(G.menu){
        var x = CANVAS_WIDTH * (e.pageX - rect.left) / rect.width,
            y = CANVAS_HEIGHT * (e.pageY - rect.top) / rect.height,
            col = ~~(x / (CANVAS_WIDTH / 4));

        G.menu.click(x, y);
    }
};

var touch = function(e){
    e.preventDefault();

    P.direction = 0;
    G.touch = true;

    touchButtons = {};

    var rect = C.getBoundingClientRect();
    for(var i = 0 ; i < e.touches.length ; i++){
        var x = CANVAS_WIDTH * (e.touches[i].pageX - rect.left) / rect.width,
            y = CANVAS_HEIGHT * (e.touches[i].pageY - rect.top) / rect.height,
            col = ~~(x / (CANVAS_WIDTH / 4));

        if(!G.menu){
            if(!col){
                P.direction = -1;
            }else if(col == 1){
                P.direction = 1;
            }else if(col == 2){
                P.throwGrenade();
            }else if(col == 3){
                P.jump(1);
            }

            touchButtons[col] = true;
        }
    }
};

addEventListener('touchstart', function(e){
    onclick(e.touches[0]);
});
addEventListener('touchstart', touch);
addEventListener('touchmove', touch);
addEventListener('touchend', touch);
