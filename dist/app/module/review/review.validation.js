"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewZodSchema = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    appointment: zod_1.z.string({
        required_error: 'Appointment is required',
    }),
    rating: zod_1.z.number({
        required_error: 'Rating is required',
    }).min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
    comment: zod_1.z.string({
        required_error: 'Comment is required',
    }),
});
exports.reviewZodSchema = {
    createReviewZodSchema,
};
