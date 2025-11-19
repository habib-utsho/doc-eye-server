"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentZodSchema = void 0;
const zod_1 = require("zod");
const appointment_validation_1 = require("../appointment/appointment.validation");
const initPaymentZodSchema = zod_1.z.object(Object.assign({ amount: zod_1.z.object({
        consultationFee: zod_1.z.number(),
        vat: zod_1.z.number().optional(),
        platformFee: zod_1.z.number().optional(),
        total: zod_1.z.number(),
    }), name: zod_1.z.string(), email: zod_1.z.string().email(), phone: zod_1.z.string() }, appointment_validation_1.appointmentZodSchema.createAppointmentZodSchema.shape));
exports.paymentZodSchema = {
    initPaymentZodSchema,
};
