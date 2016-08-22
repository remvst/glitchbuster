var
    rightArrow = cache(MOBILE_BUTTON_SIZE, MOBILE_BUTTON_SIZE, function(r){
        with(r){
            fillStyle = '#fff';
            beginPath();
            moveTo(0, 0);
            lineTo(MOBILE_BUTTON_SIZE, MOBILE_BUTTON_SIZE / 2);
            lineTo(0, MOBILE_BUTTON_SIZE);
            fill();
        }
    }),
    leftArrow = cache(MOBILE_BUTTON_SIZE, MOBILE_BUTTON_SIZE, function(r){
        with(r){
            translate(MOBILE_BUTTON_SIZE, 0);
            scale(-1, 1);
            drawImage(rightArrow, 0, 0);
        }
    }),
    jumpArrow = cache(MOBILE_BUTTON_SIZE, MOBILE_BUTTON_SIZE, function(r){
        with(r){
            translate(0, MOBILE_BUTTON_SIZE);
            rotate(-PI / 2);

            drawImage(rightArrow, 0, 0);
        }
    }),
    grenadeButton = cache(MOBILE_BUTTON_SIZE, MOBILE_BUTTON_SIZE, function(r){
        with(r){
            fillStyle = '#fff';
            beginPath();
            arc(MOBILE_BUTTON_SIZE / 2, MOBILE_BUTTON_SIZE / 2, MOBILE_BUTTON_SIZE / 2, 0, PI * 2, true);
            fill();
        }
    })
    ;
