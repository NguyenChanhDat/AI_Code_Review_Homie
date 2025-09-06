"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ollamaGlobal", {
    enumerable: true,
    get: function() {
        return ollamaGlobal;
    }
});
var _ollama = require("ollama");
var ollamaGlobal = new _ollama.Ollama({
    host: process.env.OLLAMA_URL
});
