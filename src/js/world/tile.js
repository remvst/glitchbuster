function Tile(row, col, type){
    this.x = (this.col = col) * TILE_SIZE;
    this.y = (this.row = row) * TILE_SIZE;
    this.solid = [SPAWN_ID, EXIT_ID].indexOf(type) < 0;

    this.center = {
        x: this.x + TILE_SIZE / 2,
        y: this.y + TILE_SIZE / 2
    };

    this.pushAway = function(character, dX, dY){
        var adjustments = [{
            x: this.x - CHARACTER_WIDTH / 2,
            y: character.y,
            type: LEFT
        }, {
            x: this.x + TILE_SIZE + CHARACTER_WIDTH / 2,
            y: character.y,
            type: RIGHT
        }, {
            x: character.x,
            y: this.y - CHARACTER_HEIGHT / 2,
            type: UP
        }, {
            x: character.x,
            y: this.y + TILE_SIZE + CHARACTER_HEIGHT / 2,
            type: DOWN
        }];

        var closest,
            closestDist;

        adjustments.forEach(function(adj){
            var d = Math.sqrt(
                Math.pow(adj.x - character.x, 2) +
                Math.pow(adj.y - character.y, 2)
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
        R.fillStyle = G.globalPattern || '#fff';
        save();
        translate(this.x, this.y);

        if(type == TILE_ID){
            fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        }

        if(type == FLOOR_SPIKE_ID || type == CEILING_SPIKE_ID){
            if(type == CEILING_SPIKE_ID){
                translate(0, TILE_SIZE);
                scale(1, -1);
            }

            fillRect(0, SPIKE_HEIGHT, TILE_SIZE, TILE_SIZE - SPIKE_HEIGHT);

            beginPath();
            moveTo(0, 0 + SPIKE_HEIGHT);

            var step = TILE_SIZE / SPIKES_PER_TILE;
            for(var x = step / 2 ; x < TILE_SIZE ; x += step){
                lineTo(x, 0);
                lineTo(x + step / 2, SPIKE_HEIGHT);
            }
            lineTo(TILE_SIZE, SPIKE_HEIGHT);
            fill();
        }

        if(type == EXIT_ID){
            // Halo
            drawImage(whiteHalo, TILE_SIZE / 2 - HALO_SIZE_HALF, TILE_SIZE / 2 - HALO_SIZE_HALF);

            // Arrow
            beginPath();
            moveTo(TILE_SIZE / 2 - ARROW_SIZE / 2, -ARROW_SIZE / 2 + ARROW_Y_OFFSET);
            lineTo(TILE_SIZE / 2 + ARROW_SIZE / 2, -ARROW_SIZE / 2 + ARROW_Y_OFFSET);
            lineTo(TILE_SIZE / 2, ARROW_Y_OFFSET);
            fill();

            R.fillStyle = noisePattern;

            var x = rand(NOISE_PATTERN_SIZE),
                y = rand(NOISE_PATTERN_SIZE);

            translate(x, y);
            fillRect(-x, -y, TILE_SIZE, TILE_SIZE);
        }

        restore();
    };

    this.landed = function(c){
        if(type === FLOOR_SPIKE_ID){
            // TODO kill
        }
    };

    this.tapped = function(c){
        if(type == CEILING_SPIKE_ID){
            // TODO kill
        }
    };
}
