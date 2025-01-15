"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongooseDuplicateKeyErr = exports.handleMongooseCastErr = exports.handleMongooseValidationErr = void 0;
const http_status_codes_1 = require("http-status-codes");
const handleMongooseValidationErr = (err) => {
    const statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    const message = 'Validation error!';
    const errorSources = Object.keys(err.errors).map((key) => {
        var _a;
        return {
            path: key,
            message: (_a = err.errors[key]) === null || _a === void 0 ? void 0 : _a.message,
        };
    });
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.handleMongooseValidationErr = handleMongooseValidationErr;
const handleMongooseCastErr = (err) => {
    const statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    const message = 'Cast error!';
    const errorSources = [
        {
            path: err === null || err === void 0 ? void 0 : err.path,
            message: err === null || err === void 0 ? void 0 : err.message,
        },
    ];
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.handleMongooseCastErr = handleMongooseCastErr;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleMongooseDuplicateKeyErr = (err) => {
    var _a, _b, _c;
    const statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    const message = `${(_a = Object.values(err.keyValue)) === null || _a === void 0 ? void 0 : _a[0]} is already exist!`;
    const errorSources = [
        {
            path: (_b = Object.keys(err.keyValue)) === null || _b === void 0 ? void 0 : _b[0],
            message: `${(_c = Object.values(err.keyValue)) === null || _c === void 0 ? void 0 : _c[0]} is already exist!`,
        },
    ];
    return {
        statusCode,
        message,
        errorSources,
    };
};
exports.handleMongooseDuplicateKeyErr = handleMongooseDuplicateKeyErr;
