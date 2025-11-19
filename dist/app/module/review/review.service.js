"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const review_model_1 = __importDefault(require("./review.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appointment_model_1 = __importDefault(require("../appointment/appointment.model"));
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const createReview = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the patient exist
    const patient = yield patient_model_1.default.findById(user._id);
    if (!patient) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Patient not found');
    }
    // Check if the appointment exists and is completed
    const appointmentExists = yield appointment_model_1.default.findById(payload.appointment);
    if (!appointmentExists) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Appointment not found');
    }
    if (appointmentExists.patient != user._id) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to create this review');
    }
    if (appointmentExists.status !== 'completed') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Review can only be created for completed appointments');
    }
    // Create the review
    const review = yield review_model_1.default.create(Object.assign(Object.assign({}, payload), { patient: user._id, doctor: appointmentExists.doctor }));
    return review;
});
const getAllReview = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewQuery = new QueryBuilder_1.default(review_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort}` }))
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'doctor', select: '_id doctorTitle name profileImg email' },
        { path: 'patient', select: '_id doctorTitle name profileImg email' },
        { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield (reviewQuery === null || reviewQuery === void 0 ? void 0 : reviewQuery.queryModel);
    const total = yield review_model_1.default.countDocuments(reviewQuery.queryModel.getFilter());
    return { data: result, total };
});
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield review_model_1.default.findById(id)
        .select('-__v')
        .populate('doctor', '_id doctorTitle name profileImg email')
        .populate('patient', '_id name profileImg email')
        .populate('appointment', '-createdAt -updatedAt -__v');
    if (!review) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Review not found');
    }
    return review;
});
exports.reviewService = {
    createReview,
    getAllReview,
    getReviewById,
};
