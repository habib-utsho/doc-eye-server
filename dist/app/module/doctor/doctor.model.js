"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const DoctorSchema = new mongoose_1.Schema({
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
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true,
    },
    profileImg: {
        type: String,
        default: null,
    },
    bio: {
        type: String,
    },
    doctorTitle: {
        type: String,
        enum: ['Dr.', 'Prof. Dr.', 'Assoc. Prof. Dr.', 'Asst. Prof. Dr.'],
        required: true,
    },
    doctorType: {
        type: String,
        enum: ['Medical', 'Dental', 'Veterinary'],
        required: true,
    },
    medicalSpecialties: {
        type: [mongoose_1.Types.ObjectId],
        ref: 'Specialty',
        required: true,
    },
    totalExperienceYear: {
        type: Number,
        required: true,
    },
    medicalDegree: {
        type: String,
        required: true,
    },
    consultationFee: {
        type: Number,
        required: true,
    },
    followupFee: {
        type: Number,
        required: true,
    },
    workingExperiences: [
        {
            workPlace: {
                type: String,
                required: true,
            },
            department: {
                type: String,
                required: true,
            },
            designation: {
                type: String,
                required: true,
            },
            workingPeriodStart: {
                type: Date,
                required: true,
            },
            workingPeriodEnd: {
                type: Date,
                required: true,
            },
        },
    ],
    dateOfBirth: {
        type: Date,
        required: true,
    },
    currentWorkplace: {
        workPlace: {
            type: String,
            required: true,
        },
        department: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        workingPeriodStart: {
            type: Date,
            required: true,
        },
        workingPeriodEnd: {
            type: Date,
        },
    },
    availability: {
        dayStart: {
            type: String,
            required: true,
        },
        dayEnd: {
            type: String,
            required: true,
        },
        timeStart: {
            type: String,
            required: true,
        },
        timeEnd: {
            type: String,
            required: true,
        },
    },
    district: {
        type: String,
        required: true, // Assuming TDistrict is a string
    },
    nid: {
        type: String,
        required: true,
    },
    bmdc: {
        type: String,
        required: true,
    },
    patientAttended: {
        type: Number,
        default: 0,
    },
    doctorCode: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approve', 'reject'],
        default: 'pending',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
DoctorSchema.pre('save', function (next) {
    // Add any pre-save logic here
    next();
});
// Create the Doctor model
const Doctor = mongoose_1.default.model('Doctor', DoctorSchema);
exports.default = Doctor;
