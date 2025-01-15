"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyZodSchema = void 0;
const zod_1 = require("zod");
const createSpecialtyZodSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: 'Specialty name is required',
    }),
    description: zod_1.z
        .string({
        required_error: 'Description is required',
    })
        .max(450, 'Description must be less than 450 characters'),
});
const updateSpecialtyZodSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
});
exports.specialtyZodSchema = {
    createSpecialtyZodSchema,
    updateSpecialtyZodSchema,
};
