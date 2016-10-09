"use strict";

class PixelGrid {
    constructor(width, height, numBuffers) {
        this.width = width;
        this.height = height;
        this._image = new ImageData(this.width, this.height);
        this._initAlphaValues();
    }

    _initAlphaValues() {
        for (var i = 0; i < this.width*this.height*4; i += 4) {
            this._image.data[i + 3] = 255;
        }
    }

    setPixel(x, y, c) {
        var idx = 4*(this.width*y + x);
        this._image.data[idx] = c.r;
        this._image.data[idx + 1] = c.g;
        this._image.data[idx + 2] = c.b;
    }

    get buffer() {
        return this._image.data.buffer;
    }

    setPixelGridFromBuffer(buffer) {
        var oldBuffer = this._image.data.buffer;
        this._image = new ImageData(new Uint8ClampedArray(buffer), this.width, this.height);
        return oldBuffer;
    }
}

class PixelGridRenderer {
    constructor(context, pixelGrid) {
        this._context = context;
        this._pixelGrid = pixelGrid;
        this._offscreenCanvas = document.createElement('canvas');
        this._offscreenCanvas.width = this._pixelGrid.width;
        this._offscreenCanvas.height = this._pixelGrid.height;
        this._ofscreenContext = this._offscreenCanvas.getContext('2d');

        var scaleX = this._context.canvas.clientWidth/this._pixelGrid.width;
        var scaleY = this._context.canvas.clientWidth/this._pixelGrid.height;
        this._context.scale(scaleX, scaleY);
    }

    onFPSChange(func, interval) {
        this._fpsChangeFunc = func;
        this._interval = interval || 0.2;
        this._frameCount = 0;
        this._lastTime = Date.now();
    }

    draw(context) {
        if (typeof this._fpsChangeFunc === "function") {
            this._frameCount += 1;
            var delta = (Date.now() - this._lastTime)/1000;
            if (delta >= this._interval) {
                this._fpsChangeFunc(1*this._frameCount/delta, this);
                this._frameCount = 0;
                this._lastTime = Date.now();
            }
        }

        this._ofscreenContext.putImageData(this._pixelGrid._image, 0, 0);
        this._context.drawImage(this._offscreenCanvas, 0, 0);
    }
}