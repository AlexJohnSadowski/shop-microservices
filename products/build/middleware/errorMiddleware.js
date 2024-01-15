"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(err, req, res) {
    var _a, _b, _c;
    console.error(err.name);
    res.status((_a = err.status) !== null && _a !== void 0 ? _a : 500).send({
        name: (_b = err.name) !== null && _b !== void 0 ? _b : "Internal",
        message: (_c = err.message) !== null && _c !== void 0 ? _c : "Internal Error",
    });
}
exports.errorHandler = errorHandler;
