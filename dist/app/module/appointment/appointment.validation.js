"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentZodSchema = void 0;
const zod_1 = require("zod");
const createAppointmentZodSchema = zod_1.z.object({
    doctor: zod_1.z.string({
        required_error: 'Doctor is required',
    }),
    patient: zod_1.z.string({
        required_error: 'Patient is required',
    }),
    schedule: zod_1.z.string({
        required_error: 'Schedule is required',
    }),
    status: zod_1.z
        .enum(['pending', 'confirmed', 'completed', 'canceled'], {
        message: 'Status is either pending, confirmed, completed, or canceled',
    })
        .default('pending'),
    appointmentType: zod_1.z
        .enum(['in-person', 'online'], {
        message: 'Appointment type is either in-person or online',
    })
        .default('online'),
    symptoms: zod_1.z.string().optional(),
});
const updateAppointmentStatusZodSchema = zod_1.z.object({
    status: zod_1.z.enum(['completed', 'confirmed', 'canceled'], {
        required_error: 'Status is either confirmed or canceled',
    }),
});
exports.appointmentZodSchema = {
    createAppointmentZodSchema,
    updateAppointmentStatusZodSchema,
};
