"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateErrorDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
    const message = `Duplicate field: ${value}`;
    return new appError_1.default(message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.error('ERROR', err);
        res.status(500).json({
            status: 'fail',
            message: 'Something went wrong'
        });
    }
};
const errorHandler = (err, req, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === 'development')
        sendErrorDev(err, res);
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateErrorDB(error);
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorController.js.map