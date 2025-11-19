"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MedicalReportSchema = new mongoose_1.Schema({
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null,
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null,
    },
    problems: {
        type: [String],
        required: true,
    },
    diagnosis: {
        type: String,
        required: true,
    },
    medications: [
        {
            name: {
                type: String,
                required: true,
            },
            dosage: {
                type: String,
                required: true,
            },
            frequency: {
                type: String,
                required: true,
            },
            duration: {
                type: String,
                required: true,
            },
        },
    ],
    advices: {
        type: [String],
    },
    followUpDate: {
        type: Date,
    },
}, {
    timestamps: true,
});
const MedicalReport = (0, mongoose_1.model)('MedicalReport', MedicalReportSchema);
exports.default = MedicalReport;
