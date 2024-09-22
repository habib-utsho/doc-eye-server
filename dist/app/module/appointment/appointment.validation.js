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
    appointmentDateTime: zod_1.z.string({
        required_error: 'Appointment date is required',
    }),
    appointmentType: zod_1.z
        .enum(['in-person', 'online'], {
        message: 'Appointment type is either in-person or online',
    })
        .default('online'),
    symptoms: zod_1.z.string().optional(),
});
exports.appointmentZodSchema = {
    createAppointmentZodSchema,
};
