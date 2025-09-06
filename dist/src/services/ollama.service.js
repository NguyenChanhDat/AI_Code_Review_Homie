"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getAICodeReviewResponse", {
    enumerable: true,
    get: function() {
        return getAICodeReviewResponse;
    }
});
var _ollamaconfig = require("../config/ollama.config");
var _textservice = require("./text.service");
var _octokitservice = require("./octokit.service");
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var getAICodeReviewResponse = function(input) {
    return _async_to_generator(function() {
        var octokitInstance, pullNumber, filesChangesContent, diffText;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    octokitInstance = input.octokitInstance, pullNumber = input.pullNumber;
                    return [
                        4,
                        (0, _octokitservice.fetchFileChangesContent)(octokitInstance, pullNumber)
                    ];
                case 1:
                    filesChangesContent = _state.sent();
                    console.log('filesChangesContent ', JSON.stringify(filesChangesContent, null, 2));
                    diffText = (0, _textservice.convertToSingleString)(filesChangesContent);
                    return [
                        4,
                        _ollamaconfig.ollamaGlobal.chat({
                            model: process.env.AI_MODEL || 'codellama:7b',
                            messages: [
                                {
                                    role: 'system',
                                    content: '\n      You are a senior code reviewer.\n      Your task is to:\n      - Provide a short and clear summary of the pull request changes.\n      - Point out strengths or good practices in the code, if any.\n      - Identify bad practices or potential issues. When possible, include the exact code snippets inside markdown code blocks (use ```ts ... ```) to show the problematic lines.\n      - Give constructive, practical suggestions on how to fix or improve them.\n      \n      Keep your review professional, concise, and easy to understand.\n      Structure your response under clear sections: "Summary", "Strengths", "Areas to Improve".\n      '
                                },
                                {
                                    role: 'user',
                                    content: "Here are the code changes from the pull request:\n\n".concat(diffText, "\n\nPlease provide a structured code review with:\n- High-level summary\n- Potential issues\n- Suggestions for improvement")
                                }
                            ]
                        })
                    ];
                case 2:
                    return [
                        2,
                        _state.sent()
                    ];
            }
        });
    })();
};
