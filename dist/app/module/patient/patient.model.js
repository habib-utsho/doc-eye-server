"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const patient_constant_1 = require("./patient.constant");
// Patient Schema
const patientSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    profileImg: {
        type: String,
        trim: true,
        default: 'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png',
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other '],
    },
    district: {
        type: String,
        required: true,
        enum: patient_constant_1.districts,
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    bloodGroup: {
        type: String,
        required: true,
        enum: patient_constant_1.bloodGroups,
    },
    favoriteDoctors: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Doctor',
        },
    ],
    weight: {
        type: Number,
        default: null,
    },
    height: {
        type: Number,
        default: null,
    },
    allergies: {
        type: String,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Patient Model
const Patient = (0, mongoose_1.model)('Patient', patientSchema);
exports.default = Patient;
