"use strict";

class Neighbors {

    constructor(gridWidth, gridHeight, defaultState) {
        this._gridWidth = gridWidth;
        this._gridHeight = gridHeight;
        this._defaultState = defaultState;
        this.x = -1;
        this.y = -1;
        this._idx = -1;
        this._grid = null;
        this._moore = new Array(8);
        this._vonNeuman = new Array(4);
    }

    _coords(x, y, deltaX, deltaY) {
        return (y + deltaY)*this._gridWidth + x + deltaX;
    }

    mooreCount(val) {
        // Ideally moore() and vonNeuman() would be more similar
        // But this way is faster for 8 elements.
        var startX = Math.max(this.x-1, 0);
        var endX   = Math.min(this.x+1, this._gridWidth - 1);
        var startY = Math.max(this.y-1, 0);
        var endY   = Math.min(this.y+1, this._gridHeight - 1);

        var count = 0;

        var i = 0;
        for (var x = startX; x <= endX; x++) {
            for (var y = startY; y <= endY; y++) {
                if (this._grid[y*this._gridHeight + x] === val && (x != this.x || y != this.y)) {
                    count += 1;
                    i++;
                }
            }
        }
        return count;
    }

    get vonNeuman() {
        // And this way is faster for 4 elements.
        this._vonNeuman[0] = this.getNoBoundsCheck(1,  0);
        this._vonNeuman[1] = this.getNoBoundsCheck(0,  -1);
        this._vonNeuman[2] = this.getNoBoundsCheck(-1,  0);
        this._vonNeuman[3] = this.getNoBoundsCheck(0,  1);
        return this._vonNeuman;
    }

    _getNoBoundsCheck(deltaX, deltaY) {
        return this._grid[(this.y+deltaY)*this._gridWidth + this.x + deltaX];
    }

    get(deltaX, deltaY) {
        var x = this.x + deltaX;
        var y = this.y + deltaY;
        if (x < 0 || x >= this._gridWidth ||
            y < 0 || y >= this._gridHeight) {
            return this._defaultState;
        } else {
            return this._getNoBoundsCheck(deltaX, deltaY);
        }
    }

    _setGrid(grid) {
        this._grid = grid;
        this._mooreCountsDirty = true;
    }

    _setCenter(x, y) {
        this.x = x;
        this.y = y;
        this._idx = this.y*this.gridHeight + this.x;
    }


    static _neighborsEqual(grid1, grid2, centerX, centerY, gridWidth) {
        var startX = Math.max(centerX-1, 0);
        var endX   = Math.min(centerX+1, gridWidth);
        var startY = Math.max(centerY-1, 0);
        var endY   = Math.min(centerY+1, gridWidth);

        var count = 0;

        var i = 0;
        for (var x = startX; x <= endX; x++) {
            for (var y = startY; y <= endY; y++) {
                var idx = y*gridWidth + x;
                if (grid1[idx] !== grid2[idx]) {
                    return false;
                }
            }
        }
        return true;
    }

    static _setGrid(grid, centerX, centerY, val, gridWidth) {
        var startX = Math.max(centerX-1, 0);
        var endX   = Math.min(centerX+1, gridWidth);
        var startY = Math.max(centerY-1, 0);
        var endY   = Math.min(centerY+1, gridWidth);

        var count = 0;

        var i = 0;
        for (var x = startX; x <= endX; x++) {
            for (var y = startY; y <= endY; y++) {
                if (x !== centerX || y !== centerY) {
                    grid[y*gridWidth + x] = val;
                }
            }
        }
    }
}