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
exports.paymentService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const payment_model_1 = __importDefault(require("./payment.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = __importDefault(require("mongoose"));
const appointment_model_1 = __importDefault(require("../appointment/appointment.model"));
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const initPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { doctor, patient } = payload || {};
        const isExistDoctor = yield doctor_model_1.default.findById(doctor);
        const isExistPatient = yield patient_model_1.default.findById(patient);
        if (!payload.schedule) {
            throw new Error('Schedule is required');
        }
        const isExistSchedule = yield appointment_model_1.default.findOne({
            doctor: doctor,
            patient: patient,
            schedule: new Date(payload.schedule),
        });
        if (!isExistDoctor) {
            throw new Error('Doctor not found');
        }
        if (!isExistPatient) {
            throw new Error('Patient not found');
        }
        if (isExistSchedule) {
            throw new Error('Schedule already exist');
        }
        const payment = yield payment_model_1.default.create([Object.assign(Object.assign({}, payload), { amount: typeof payload.amount === 'string' ? JSON.parse(decodeURIComponent(payload.amount)) : payload.amount, status: 'confirmed' })], { session });
        // const gmt6Schedule = moment(payload.schedule).tz('Asia/Dhaka').toDate()
        // console.log({ schedule: payload.schedule });
        const appointmentPayload = Object.assign(Object.assign({}, payload), { schedule: payload.schedule, status: (payload === null || payload === void 0 ? void 0 : payload.status) || 'pending', payment: payment[0]._id });
        const appointment = yield appointment_model_1.default.create([appointmentPayload], {
            session,
        });
        const updatedPayment = yield payment_model_1.default.findByIdAndUpdate(payment[0]._id, { appointment: appointment[0]._id }, { new: true, session });
        yield doctor_model_1.default.findByIdAndUpdate(doctor, { $inc: { patientAttended: 1 } }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        // if (!payment) {
        //   throw new AppError(StatusCodes.NOT_FOUND, 'Payment not created')
        // }
        return { payment: updatedPayment, appointment: appointment[0] };
    }
    catch (err) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, err.message);
    }
});
const getAllPayment = (query, currentUser) => __awaiter(void 0, void 0, void 0, function* () {
    let filteredQuery = {};
    if (currentUser.role === 'doctor') {
        filteredQuery = { doctor: currentUser._id };
    }
    else if (currentUser.role === 'patient') {
        filteredQuery = { patient: currentUser._id };
    }
    const paymentQuery = new QueryBuilder_1.default(payment_model_1.default.find(filteredQuery), Object.assign(Object.assign({}, query), { sort: `${query.sort} -createdAt` }))
        .populateQuery([
        {
            path: 'appointment',
            select: '-createdAt -updatedAt -__v',
        },
        { path: 'doctor', select: 'name doctorTitle profileImg' },
        { path: 'patient', select: 'name profileImg' },
    ])
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery();
    const result = yield (paymentQuery === null || paymentQuery === void 0 ? void 0 : paymentQuery.queryModel);
    const total = yield payment_model_1.default.countDocuments(paymentQuery.queryModel.getFilter());
    return { data: result, total };
});
const getPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.default.findById(id)
        .select('-__v')
        .populate('appointment', '-createdAt -updatedAt -__v');
    if (!payment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Payment not found');
    }
    return payment;
});
exports.paymentService = {
    initPayment,
    getAllPayment,
    getPaymentById,
};
