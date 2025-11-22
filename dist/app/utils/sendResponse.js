"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, statusCode, format) => {
    res.status(statusCode).send({
        success: format === null || format === void 0 ? void 0 : format.success,
        message: format === null || format === void 0 ? void 0 : format.message,
        data: (format === null || format === void 0 ? void 0 : format.data) || null,
        meta: (format === null || format === void 0 ? void 0 : format.meta) || null,
        accessToken: (format === null || format === void 0 ? void 0 : format.accessToken) || null,
        refreshToken: (format === null || format === void 0 ? void 0 : format.refreshToken) || null,
    });
};
exports.default = sendResponse;
