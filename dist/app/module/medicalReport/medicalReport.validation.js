"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalReportZodSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = require("mongoose");
const objectId = zod_1.z.string().refine((val) => mongoose_1.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId',
});
const createMedicalReportZodSchema = zod_1.z.object({
    appointment: objectId,
    doctor: objectId,
    patient: objectId,
    problems: zod_1.z
        .array(zod_1.z.string().min(1, 'Problem cannot be empty'))
        .nonempty('At least one problem is required'),
    diagnosis: zod_1.z.string().min(1, 'Diagnosis is required'),
    medications: zod_1.z
        .array(zod_1.z.object({
        name: zod_1.z.string().min(1, 'Medication name is required'),
        dosage: zod_1.z.string().min(1, 'Dosage is required'),
        frequency: zod_1.z.string().min(1, 'Frequency is required'),
        duration: zod_1.z.string().min(1, 'Duration is required'),
    }))
        .optional(),
    advices: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    tests: zod_1.z.array(zod_1.z.string().min(1)).optional(),
    followUpDate: zod_1.z.coerce.date().optional(),
});
exports.medicalReportZodSchema = {
    createMedicalReportZodSchema,
};
