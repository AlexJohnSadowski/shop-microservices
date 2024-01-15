"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createAppError = (statusCode = 500, message) => {
    const error = new Error(message);
    error.name = "AppError";
    error.isOperational = true;
    error.status = statusCode;
    Error.captureStackTrace(error, createAppError);
    return error;
};
exports.default = createAppError;
