"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AppointmentSchema = new mongoose_1.Schema({
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
    },
    payment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    schedule: {
        type: Date,
        required: true,
    },
    appointmentType: {
        type: String,
        enum: ['in-person', 'online'],
        default: 'online',
    },
    symptoms: {
        type: String,
        trim: true,
        default: null,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'canceled'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
// Create the Appointment model
const Appointment = (0, mongoose_1.model)('Appointment', AppointmentSchema);
exports.default = Appointment;
