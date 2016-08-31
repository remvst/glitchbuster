if(DEBUG){

var PathFinder = function(matrix){
    this.matrix = matrix;
    this.explored = {};
    this.queued = [];
    this.queuedMap = {};
    this.energyCutOff = 5;
    this.jumpDistanceCutOff = 6;

    this.startRow = null;
    this.startCol = null;

    this.exitRow = null;
    this.exitCol = null;
};

PathFinder.prototype.key = function(row, col){
    return row + '-' + col;
};

PathFinder.prototype.isQueued = function(row, col){
    return !!this.queuedCell(row, col);
};

PathFinder.prototype.queuedCell = function(row, col){
    return this.queuedMap[this.key(row, col)];
};

PathFinder.prototype.isExplored = function(row, col){
    return !!this.exploredCell(row, col);
};

PathFinder.prototype.exploredCell = function(row, col){
    return this.explored[this.key(row, col)];
};

PathFinder.prototype.isStart = function(row, col){
    return row === this.startRow && col === this.startCol;
};

PathFinder.prototype.isExit = function(row, col){
    return row === this.exitRow && col === this.exitCol;
};

PathFinder.prototype.isNotVoid = function(row, col){
    return this.matrix[row] && this.matrix[row][col] !== VOID_ID && this.matrix[row][col] !== EXIT_ID;
};

PathFinder.prototype.buildPathFromRoot = function(root){
    var path = [];
    while(root.parent){
        path.unshift({
            'row': root.row,
            'col': root.col
        });
        root = root.parent;
    }
    return path;
};

PathFinder.prototype.explore = function(startRow, startCol, exitRow, exitCol){
    this.startRow = startRow;
    this.startCol = startCol;

    this.exitRow = exitRow;
    this.exitCol = exitCol;

    var firstItem = {
        'row': this.startRow,
        'col': this.startCol,
        'distance': 0,
        'energy': 0,
        'jumpDistance': 0
    };

    this.queued.push(firstItem);

    var exitCell;
    for(var i = 0 ; i < 400 && this.queued.length > 0 && !exitCell ; i++){
        this.exploreStep();

        exitCell = this.queuedCell(exitRow, exitCol);
    }

    if(exitCell){
        return {
            'path': this.buildPathFromRoot(exitCell),
            'iterations': i
        };
    }else{
        return null;
    }
};

PathFinder.prototype.exploreStep = function(){
    var item = this.pickNonExploredItem();
    if(!item){
        return;
    }

    this.exploreItem(item);
};

PathFinder.prototype.exploreItem = function(item){
    var key = this.key(item.row, item.col);
    this.explored[key] = item;
    this.queuedMap[key] = null;

    var neighbors = this.neighbors(item);
    neighbors.forEach(function(neighbor){
        this.maybeAddToNonExplored(neighbor, item);
    }.bind(this));
};

PathFinder.prototype.pickNonExploredItem = function(){
    if(this.queued.length === 0){
        return null;
    }

    var minDistance,
        minDistanceIndex = -1;
    this.queued.forEach(function(item, index){
        var manhattanDistance = Math.abs(item.row - this.exitRow) + Math.abs(item.col - this.exitCol);
        var estimatedDistance = manhattanDistance;
        if(minDistanceIndex < 0 || estimatedDistance < minDistance){
            minDistance = estimatedDistance;
            minDistanceIndex = index;
        }
    }.bind(this));

    return this.queued.splice(minDistanceIndex, 1)[0];
};

PathFinder.prototype.neighbors = function(item){
    var neighbors = [];

    // If we're currently going downwards, let's not add the jump up
    if(!item.falling){
        neighbors.push({
            // Up
            'row': item.row - 1,
            'col': item.col,
            'distance': item.distance + 1,
            'energy': item.energy + 1,
            'jumpDistance': item.jumpDistance,
            'falling': false,
            'parent': item
        });
    }

    neighbors.push({
        // Down
        'row': item.row + 1,
        'col': item.col,
        'distance': item.distance + 1,
        'energy': item.energy, // can't have negative energy
        'jumpDistance': item.jumpDistance,
        'falling': true,
        'parent': item
    });

    neighbors.push({
        // Left
        'row': item.row,
        'col': item.col - 1,
        'distance': item.distance + 1,
        'energy': item.energy,
        'jumpDistance': item.jumpDistance + 1,
        'falling': item.falling,
        'parent': item
    });

    neighbors.push({
        // Right
        'row': item.row,
        'col': item.col + 1,
        'distance': item.distance + 1,
        'energy': item.energy,
        'jumpDistance': item.jumpDistance + 1,
        'falling': item.falling,
        'parent': item
    });

    return neighbors;
};

PathFinder.prototype.maybeAddToNonExplored = function(item){
    if(item.energy >= this.energyCutOff){
        // Too much energy required
        return;
    }

    if(item.jumpDistance >= this.jumpDistanceCutOff){
        // Jump is too far
        return;
    }

    if(item.row < 0 || item.row >= this.matrix.length || item.col < 0 || item.col >= this.matrix[0].length){
        // Out of bounds, let's ignore
        return;
    }

    var queuedCell = this.queuedCell(item.row, item.col);
    if(queuedCell){
        // Already queued
        queuedCell.energy = Math.min(queuedCell.jumpDistance, item.energy);
        queuedCell.jumpDistance = Math.min(queuedCell.jumpDistance, item.jumpDistance);
        queuedCell.falling = queuedCell.falling && item.falling;

        return;
    }

    if(this.matrix[item.row][item.col] !== VOID_ID && this.matrix[item.row][item.col] !== EXIT_ID){
        // It's an obstacle, let's not explore it
        return;
    }

    var exploredCell = this.exploredCell(item.row, item.col);
    //if(exploredCell && exploredCell.distance < item.distance && exploredCell.energy < item.energy){
    if(exploredCell){
        if(exploredCell.jumpDistance > item.jumpDistance){
            //this.explored[this.key(item.row, item.col)] = null;
        }else{
            // Already explored and not a shortcut
            // TODO do shortcuts
            return;
        }
    }

    // If the cell is just over the floor, no need to have energy nor momentum
    if(this.isNotVoid(item.row + 1, item.col)){
        item.energy = 0;
        item.jumpDistance = 0;
        item.falling = false;
    }

    this.queuedMap[this.key(item.row, item.col)] = item;
    this.queued.push(item);
};

PathFinder.prototype.toString = function(){
    var s = '';
    for(var row = 0 ; row < this.matrix.length ; row++){
        for(var col = 0 ; col < this.matrix[0].length ; col++){
            if(this.isStart(row, col)){
                s += 's';
            }else if(this.isExit(row, col)){
                s += 'e';
            }else if(this.isExplored(row, col)){
                var exploredCell = this.exploredCell(row, col);
                //s += energyColorMap[exploredCell.energy]('+');
                //s += colors[exploredCell.falling ? 'green' : 'red']('+');
                s += '+';
            }else{
                s += this.matrix[row][col] || ' ';
            }
        }
        s += '\n';
    }
    return s.trim();
};

var tuto = [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,6,0,0,0,0,0,1,1,1,0,0,0,0,0,6,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,5,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,7,7,1,1,7,7,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];

var earlyLevel = [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,1,1,6,1,1,1,6,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,6,1,1,1,1,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,1,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,7,1,1,1,1,1,1,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,4,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,1,1,1,7,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,1,1,1,1,0,0,0,7,1,1,0,6,1,0,1,1,1,0,0,0,1,1,1,1,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,0,0,1,2,2,2,2,2],[2,2,2,2,2,1,0,0,1,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,1,1,1,1,5,0,1,2,2,2,2,2],[2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];

var matrix = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 1]
];

/*
var finder = new PathFinder(earlyLevel);
console.log(finder.explore(12, 10, 10, 29));

console.log(finder.toString());
console.log(finder.exploredCell(10, 18));
*/

}
