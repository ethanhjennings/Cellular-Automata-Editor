"use strict";

class PixleGrid {
    constructor(ctx, width, height) {
        this.width = width;
        this.height = height;
        this._context = ctx;
        this._image = this._context.createImageData(this.width, this.height);
        this._offscreenCanvas = document.createElement('canvas');
        this._offscreenCanvas.width = width;
        this._offscreenCanvas.height = height;
        this._ofscreenContext = this._offscreenCanvas.getContext('2d');
        this._initAlphaValues();

        var scaleX = this._context.canvas.clientWidth/this.width;
        var scaleY = this._context.canvas.clientWidth/this.height;
        this._context.scale(scaleX, scaleY);
    }

    _initAlphaValues() {
        for (var i = 0; i < this.width*this.height*4; i += 4) {
            this._image.data[i + 3] = 255;
        }
    }

    onFPSChange(func, interval) {
        this._fpsChangeFunc = func;
        this._interval = interval || 0.2;
        this._frameCount = 0;
        this._lastTime = Date.now();
    }

    setPixel(x, y, r, g, b) {
        var idx = 4*(this.width*y + x);
        this._image.data[idx] = r;
        this._image.data[idx + 1] = g;
        this._image.data[idx + 2] = b;
    }

    draw() {
        if (typeof this._fpsChangeFunc === "function") {
            this._frameCount += 1;
            var delta = (Date.now() - this._lastTime)/1000;
            if (delta >= this._interval) {
                this._fpsChangeFunc(1*this._frameCount/delta, this);
                this._frameCount = 0;
                this._lastTime = Date.now();
            }
        }

        this._ofscreenContext.putImageData(this._image, 0, 0);
        this._context.drawImage(this._offscreenCanvas, 0, 0);
    }
}