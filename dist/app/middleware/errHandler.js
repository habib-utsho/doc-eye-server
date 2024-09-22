"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrHandler = exports.notFoundErrHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const handleZodErr_1 = __importDefault(require("../errors/handleZodErr"));
const handleMongooseErr_1 = require("../errors/handleMongooseErr");
const notFoundErrHandler = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res
        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
        .send({ success: false, message: error === null || error === void 0 ? void 0 : error.message, error: error });
};
exports.notFoundErrHandler = notFoundErrHandler;
const globalErrHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    let message = err.message || 'Internal server error';
    let errorSources = [
        {
            path: '',
            message: 'Internal server error',
        },
    ];
    //   zod error
    if (err instanceof zod_1.ZodError) {
        const ourErr = (0, handleZodErr_1.default)(err);
        message = ourErr.message;
        statusCode = ourErr.statusCode;
        errorSources = ourErr.errorSources;
    }
    // mongoose validation error
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        const ourErr = (0, handleMongooseErr_1.handleMongooseValidationErr)(err);
        message = ourErr.message;
        statusCode = ourErr.statusCode;
        errorSources = ourErr.errorSources;
    }
    //   Cast error
    if (err instanceof mongoose_1.default.Error.CastError) {
        const ourErr = (0, handleMongooseErr_1.handleMongooseCastErr)(err);
        message = ourErr.message;
        statusCode = ourErr.statusCode;
        errorSources = ourErr.errorSources;
    }
    // Duplicate key err
    if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
        const ourErr = (0, handleMongooseErr_1.handleMongooseDuplicateKeyErr)(err);
        message = ourErr.message;
        statusCode = ourErr.statusCode;
        errorSources = ourErr.errorSources;
    }
    // Send response
    res.status(statusCode).send({
        success: false,
        message,
        errorSources,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err === null || err === void 0 ? void 0 : err.stack,
    });
};
exports.globalErrHandler = globalErrHandler;
