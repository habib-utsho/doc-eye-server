"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ReviewSchema = new mongoose_1.Schema({
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
    appointment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
// Create the Review model
const Review = (0, mongoose_1.model)('Review', ReviewSchema);
exports.default = Review;
