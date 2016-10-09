"use strict";

importScripts("Neighbors.js");
importScripts("PixelGrid.js");
importScripts("AutomataRunner.js");

var numPixelBuffers = 3;

this.pixelBuffers = new Array(numPixelBuffers);

this.codeObject = null;
this.runner = null;

onmessage = function(e) {
    if (e.data.type === "begin") {

        codeObject = eval("(" + e.data.codeObject + ")");

        for (var i = 0; i < numPixelBuffers; i++) {
            pixelBuffers[i] = new PixelGrid(e.data.width, e.data.height);
        }

        runner = new AutomataRunner2D(e.data.width,      e.data.height, 
                                        codeObject, e.data.initialCells);

        this.runner.runStep();
        postMessage(this.runner.pixelGrid.buffer, [this.runner.pixelGrid.buffer]);
    } else if (e.data.type === "step") {
        this.runner.pixelGrid.setPixelGridFromBuffer(e.data.buffer)
        this.runner.runStep();
        postMessage(this.runner.pixelGrid.buffer, [this.runner.pixelGrid.buffer]);
    }
}