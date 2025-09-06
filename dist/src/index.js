"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _express = /*#__PURE__*/ _interop_require_default(require("express"));
var _cors = /*#__PURE__*/ _interop_require_default(require("cors"));
var _bodyparser = /*#__PURE__*/ _interop_require_default(require("body-parser"));
var _aiServercontroller = require("./controller/aiServer.controller.js");
var _dotenv = require("dotenv");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
(0, _dotenv.config)({
    path: '.env'
});
var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_bodyparser.default.json());
app.use(_bodyparser.default.urlencoded({
    extended: true
}));
app.post('/review', _aiServercontroller.postGitInfor);
app.listen(process.env.PORT_SERVER, function() {
    console.log("Server running at http://localhost:".concat(process.env.PORT_SERVER));
});
