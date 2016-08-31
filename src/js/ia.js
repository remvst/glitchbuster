const colors = require('colors/safe');

var VOID_ID = 0;

var energyColorMap = [colors.white, colors.green, colors.blue, colors.yellow, colors.magenta, colors.red];

var PathFinder = function(matrix){
    this.matrix = matrix;
    this.explored = {};
    this.queued = [];
    this.queuedMap = {};
    this.energyCutOff = 5;

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
    return this.matrix[row] && this.matrix[row][col] !== VOID_ID;
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
        'energy': 0
    };

    this.queued.push(firstItem);

    for(var i = 0 ; i < 200 && this.queued.length > 0 ; i++){
        this.exploreStep();

        var exitCell = this.queuedCell(exitRow, exitCol);
        if(exitCell){
            console.log('found the exit, distance:' + exitCell.distance);
            return;
        }
    }

    console.log('did not find the exit');
};

PathFinder.prototype.exploreStep = function(){
    var item = this.pickNonExploredItem();
    if(!item){
        console.log('Nothing left to explore');
        return;
    }

    this.exploreItem(item);
};

PathFinder.prototype.exploreItem = function(item){
    console.log('Exploring ' + item.row + ',' + item.col);

    var key = this.key(item.row, item.col);
    this.explored[key] = item;
    this.queued[key] = null;

    var neighbors = this.neighbors(item);
    neighbors.forEach(function(neighbor){
        this.maybeAddToNonExplored(neighbor, item);
    }.bind(this));

    console.log(this.queued.length + ' items left to explore');
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
    return [{
        // Up
        'row': item.row - 1,
        'col': item.col,
        'distance': item.distance + 1,
        'energy': item.energy + 1
    }, {
        // Down
        'row': item.row + 1,
        'col': item.col,
        'distance': item.distance + 1,
        'energy': item.energy // can't have negative energy
    }, {
        // Left
        'row': item.row,
        'col': item.col - 1,
        'distance': item.distance + 1,
        'energy': item.energy + 1
    }, {
        // Right
        'row': item.row,
        'col': item.col + 1,
        'distance': item.distance + 1,
        'energy': item.energy + 1
    }];
};

PathFinder.prototype.maybeAddToNonExplored = function(item){
    if(item.energy >= this.energyCutOff){
        // Too much energy required
        return;
    }

    if(item.row < 0 || item.row >= this.matrix.length || item.col < 0 || item.col >= this.matrix[0].length){
        // Out of bounds, let's ignore
        return;
    }

    var queuedCell = this.queuedCell(item.row, item.col);
    if(queuedCell){
        // Already queued
        if(queuedCell.energy > item.energy){
            // Energy shortcut
            queuedCell.energy = item.energy;
        }

        return;
    }

    if(this.matrix[item.row][item.col] != VOID_ID){
        // It's an obstacle, let's not explore it
        return;
    }

    var exploredCell = this.isExplored(item.row, item.col);
    //if(exploredCell && exploredCell.distance < item.distance && exploredCell.energy < item.energy){
    if(exploredCell){
        // Already explored and not a shortcut
        // TODO do shortcuts
        return;
    }

    // If the cell is just over the floor, no need to have energy
    if(this.isNotVoid(item.row + 1, item.col)){
        item.energy = 0;
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
                s += energyColorMap[exploredCell.energy]('+');
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

var finder = new PathFinder(earlyLevel);
finder.explore(12, 10, 14, 30);

console.log(finder.toString());

console.log(finder.exploredCell(10, 36));
