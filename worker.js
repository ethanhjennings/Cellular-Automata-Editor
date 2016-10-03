"use strict";

importScripts("Neighbors.js");
importScripts("PixelGrid.js");
importScripts("AutomataRunner.js");


onmessage = function(e) {
    if (e.data.type === "begin") {

        this.codeObject = JSON.parse(e.data.codeObject, function (k, v) {
            if (k === "___isFunction" || k ==="___")
            if (v.___isFunction) {
                return eval("(" + v.___value + ")");
            } else {
                return v.___value;
            }
        });

        var pixelBuffers = new Array(numPixelBuffers);
        for (var i = 0; i < numPixelBuffers; i++) {
            pixelBuffers[i] = new PixelGrid(e.data.width, e.data.height);
        }

        this.runner = new AutomataRunner(e.data.width,      e.data.height, 
                                         this.codeObject, e.data.initialCells);
    } else if (e.data.type === "step") {
        this.runner.pixelGrid.setPixelGridFromBuffer(e.data.buffer)
        this.runner.runStep();
        postMessage(this.runner.pixelGrid.buffer, [this.runner.pixelGrid.buffer]);
    }
}