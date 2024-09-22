"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
// Custom password validation regex for security criteria
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const createUserZodSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: 'Email is required' }).email(),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(8, 'Password must be at least 8 characters long')
        .regex(passwordRegex, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    needsPasswordChange: zod_1.z.boolean().optional(),
    role: zod_1.z.enum(['admin', 'doctor', 'patient']),
    status: zod_1.z.enum(['active', 'inactive']),
    isDeleted: zod_1.z.boolean().optional(),
});
exports.createUserZodSchema = createUserZodSchema;
