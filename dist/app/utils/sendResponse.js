"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, format) => {
    res.status(statusCode).send({
        success: format === null || format === void 0 ? void 0 : format.success,
        message: format === null || format === void 0 ? void 0 : format.message,
        data: (format === null || format === void 0 ? void 0 : format.data) || null,
        meta: (format === null || format === void 0 ? void 0 : format.meta) || null,
    });
};
exports.default = sendResponse;
