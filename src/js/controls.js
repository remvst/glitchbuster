var touchButtons = {},
    downKeys = {};

function reevalControls(e){
    P.direction = 0;
    if(downKeys[37] || downKeys[65]){
        P.direction = -1;
    }
    if(downKeys[39] || downKeys[68]){
        P.direction = 1;
    }
    P.lookingDown = downKeys[40] || downKeys[83];
}

onkeydown = function(e){
    if(!downKeys[38] && e.keyCode == 38 || !downKeys[87] && e.keyCode == 87){
        P.jump(1);
    }

    if(!downKeys[32] && e.keyCode == 32){
        P.prepareGrenade();
    }

    if(DEBUG && e.keyCode === 68){
        P.die();
    }

    downKeys[e.keyCode] = true;
    reevalControls(e);
};

onkeyup = function(e){
    if(e.keyCode == 32){
        P.throwGrenade();
    }

    downKeys[e.keyCode] = false;
    reevalControls(e);
};

onclick = function(e){
    var rect = C.getBoundingClientRect();
    if(G.menu){
        var x = CANVAS_WIDTH * (e.pageX - rect.left) / rect.width,
            y = CANVAS_HEIGHT * (e.pageY - rect.top) / rect.height;

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
            col = ~~(x / (CANVAS_WIDTH / 4));

        if(!G.menu){
            if(!col){
                P.direction = -1;
            }else if(col == 1){
                P.direction = 1;
            }else if(col == 2){
                P.prepareGrenade();
            }else if(col == 3){
                P.jump(1);
            }

            touchButtons[col] = true;
        }
    }

    if(P.preparingGrenade && !touchButtons[2]){
        P.throwGrenade();
    }
};

addEventListener('touchstart', function(e){
    onclick(e.touches[0]);
});
addEventListener('touchstart', touch);
addEventListener('touchmove', touch);
addEventListener('touchend', touch);
