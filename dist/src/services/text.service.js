"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "convertToSingleString", {
    enumerable: true,
    get: function() {
        return convertToSingleString;
    }
});
var convertToSingleString = function(filesChangesContent) {
    return filesChangesContent.data.map(function(file) {
        return "File: ".concat(file.filename, "\nStatus: ").concat(file.status, "\nChanges:\n").concat(file.patch || '(no patch available)', "\n");
    }).join('\n---\n');
};
