"use strict";

class AutomataRunner2D {
    constructor(width, height, codeObject, initialCells) {
        this._width = width;
        this._height = height;
        var numCells = this._width*this._height;

        this._codeObject = codeObject;
        this.pixelGrid = new PixelGrid(this._width, this._height);

        this._frontCellBuffer = initialCells;
        this._backCellBuffer = new Array(numCells);

        this._neighbors = new Neighbors(this._width, this._height, 0);
    }

    runStep() {
        this._neighbors._setGrid(this._frontCellBuffer);

        var i = 0;
        for (var y = 0; y < this._height; y++) {
            for (var x = 0; x < this._width; x++) {
                this._neighbors._setCenter(x, y);
                var newState = codeObject.update(this._frontCellBuffer[i], this._neighbors);
                this._backCellBuffer[i] = newState;
                this.pixelGrid.setPixel(x, y, this._codeObject.color(newState));
                i++;
            }
        }

        // swap buffers
        var tempBuffer = this._backCellBuffer;
        this._backCellBuffer = this._frontCellBuffer
        this._frontCellBuffer = tempBuffer;
    }
}