"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authZodSchema = void 0;
const zod_1 = require("zod");
const signinZodSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string(),
});
const forgetPasswordZodSchema = zod_1.z.object({
    email: zod_1.z.string(),
});
const changePasswordZodSchema = zod_1.z.object({
    oldPassword: zod_1.z.string(),
    newPassword: zod_1.z.string(),
});
const resetPasswordZodSchema = zod_1.z.object({
    email: zod_1.z.string(),
    newPassword: zod_1.z.string(),
});
exports.authZodSchema = {
    signinZodSchema,
    forgetPasswordZodSchema,
    changePasswordZodSchema,
    resetPasswordZodSchema,
};
