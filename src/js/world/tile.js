function Tile(row, col, type){
    this.x = (this.col = col) * TILE_SIZE;
    this.y = (this.row = row) * TILE_SIZE;
    this.solid = [SPAWN_ID, EXIT_ID].indexOf(type) < 0;
    this.type = type;

    this.alpha = 1;
    this.sizeScale = 1;

    this.center = {
        x: this.x + TILE_SIZE / 2,
        y: this.y + TILE_SIZE / 2
    };

    this.pushAway = function(character, w, h){
        var adjustments = [{
            x: this.x - (w || CHARACTER_WIDTH) / 2,
            y: character.y,
            type: LEFT
        }, {
            x: this.x + TILE_SIZE + (w || CHARACTER_WIDTH) / 2,
            y: character.y,
            type: RIGHT
        }, {
            x: character.x,
            y: this.y - (h || CHARACTER_HEIGHT) / 2,
            type: UP
        }, {
            x: character.x,
            y: this.y + TILE_SIZE + (h || CHARACTER_HEIGHT) / 2,
            type: DOWN
        }];

        var closest,
            closestDist;

        adjustments.forEach(function(adj){
            var d = sqrt(
                pow(adj.x - character.x, 2) +
                pow(adj.y - character.y, 2)
            );
            if(!closest || d < closestDist){
                closest = adj;
                closestDist = d;
            }
        });

        character.x = closest.x;
        character.y = closest.y;

        return closest.type;
    };

    this.render = function(){
        if(!G.hideTiles && !this.hidden){
            R.fillStyle = '#fff';

            if(shittyMode){
                var colorChar = ~~(between(0, 1 - dist(this.center, P) / 800, 1) * 0xf);
                R.fillStyle = '#' + colorChar.toString(16) + colorChar.toString(16) + colorChar.toString(16);
            }

            save();
            translate(this.center.x, this.center.y);
            scale(this.sizeScale, this.sizeScale);
            translate(evaluate(-TILE_SIZE / 2), evaluate(-TILE_SIZE / 2));

            if(type == TILE_ID || type == UNBREAKABLE_TILE_ID){
                fillRect(0, 0, TILE_SIZE, TILE_SIZE);
            }

            if(type == FLOOR_SPIKE_ID || type == CEILING_SPIKE_ID){
                if(type == CEILING_SPIKE_ID){
                    translate(0, TILE_SIZE);
                    scale(1, -1);
                }

                fillRect(0, SPIKE_HEIGHT, TILE_SIZE, evaluate(TILE_SIZE - SPIKE_HEIGHT));

                beginPath();
                moveTo(0, SPIKE_HEIGHT);

                var step = evaluate(TILE_SIZE / SPIKES_PER_TILE);
                for(var x = step / 2 ; x < TILE_SIZE ; x += step){
                    lineTo(x, 0);
                    lineTo(x + step / 2, SPIKE_HEIGHT);
                }
                lineTo(TILE_SIZE, SPIKE_HEIGHT);
                fill();
            }

            if(type == EXIT_ID){
                // Halo
                if(!shittyMode){
                    drawImage(whiteHalo, evaluate(TILE_SIZE / 2 - HALO_SIZE_HALF), evaluate(TILE_SIZE / 2 - HALO_SIZE_HALF));
                }

                if(this.alpha == 1){
                    // Bug ID
                    R.font = '14pt Courier New';

                    fillText(
                        'Bug #' + G.currentLevel,
                        evaluate(TILE_SIZE / 2),
                        evaluate(-ARROW_SIZE + ARROW_Y_OFFSET - 10)
                    );

                    // Arrow
                    beginPath();
                    moveTo(evaluate(TILE_SIZE / 2 - ARROW_SIZE / 2), evaluate(-ARROW_SIZE / 2 + ARROW_Y_OFFSET));
                    lineTo(evaluate(TILE_SIZE / 2 + ARROW_SIZE / 2), evaluate(-ARROW_SIZE / 2 + ARROW_Y_OFFSET));
                    lineTo(evaluate(TILE_SIZE / 2), evaluate(ARROW_Y_OFFSET));
                    fill();
                }

                R.globalAlpha = this.alpha;

                R.fillStyle = noisePattern;

                var x = rand(NOISE_PATTERN_SIZE),
                    y = rand(NOISE_PATTERN_SIZE);

                translate(x, y);
                fillRect(-x, -y, TILE_SIZE, TILE_SIZE);
            }

            restore();
        }
    };

    this.landed = function(c){
        if(type === FLOOR_SPIKE_ID){
            c.hurt(this.center);
        }
    };

    this.tapped = function(c){
        if(type == CEILING_SPIKE_ID){
            c.hurt(this.center);
        }
    };
}
