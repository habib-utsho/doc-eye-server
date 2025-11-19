"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentZodSchema = void 0;
const zod_1 = require("zod");
const createPaymentZodSchema = zod_1.z.object({
    trans_id: zod_1.z.string(),
    amount: zod_1.z.object({
        consultationFee: zod_1.z.number(),
        vat: zod_1.z.number().optional(),
        platformFee: zod_1.z.number().optional(),
        total: zod_1.z.number(),
    }),
    paymentMethod: zod_1.z.enum(['bKash', 'SSLCOMMERZ', 'aamarPay'], {
        message: 'Payment method is either bKash, SSLCOMMERZ or aamarPay',
    }).optional(),
});
exports.paymentZodSchema = {
    createPaymentZodSchema,
};
