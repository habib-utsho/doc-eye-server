"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    trans_id: {
        type: String,
        required: true,
        unique: true,
    },
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Appointment',
        default: null,
    },
    patient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Patient',
        default: null,
    },
    doctor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Doctor',
        default: null,
    },
    amount: {
        consultationFee: {
            type: Number,
            required: true,
        },
        vat: {
            type: Number,
            default: 0,
        },
        platformFee: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    paymentMethod: {
        type: String,
        enum: ['bKash', 'SSLCOMMERZ', 'aamarPay'],
        default: 'aamarPay',
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending',
    },
}, {
    timestamps: true,
});
const Payment = (0, mongoose_1.model)('Payment', PaymentSchema);
exports.default = Payment;
