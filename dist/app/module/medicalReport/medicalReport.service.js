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
exports.medicalReportService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const medicalReport_model_1 = __importDefault(require("./medicalReport.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appointment_model_1 = __importDefault(require("../appointment/appointment.model"));
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createMedicalReport = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        // Ensure patient exists
        const patient = yield patient_model_1.default.findById(payload.patient);
        if (!patient) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Patient not found');
        }
        // Ensure appointment exists
        const appointmentExists = yield appointment_model_1.default.findById(payload.appointment);
        if (!appointmentExists) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Appointment not found');
        }
        if (appointmentExists.doctor.toString() !== user._id) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to create this medical report');
        }
        if (appointmentExists.status !== 'confirmed') {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Medical report can only be created for confirmed appointments');
        }
        // Create medical report
        const report = yield medicalReport_model_1.default.create([payload], { session });
        const appointment = yield appointment_model_1.default.findByIdAndUpdate(payload.appointment, { status: 'completed' }, { new: true, session });
        yield session.commitTransaction();
        session.endSession();
        return { report: report[0], appointment };
    }
    catch (err) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, err.message);
    }
});
const getAllMedicalReports = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const reportQuery = new QueryBuilder_1.default(medicalReport_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} -createdAt` }))
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        {
            path: 'doctor',
            select: '_id doctorTitle doctorType doctorCode name profileImg email',
        },
        {
            path: 'patient',
            select: '_id name gender dateOfBirth profileImg weight email',
        },
        { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield reportQuery.queryModel;
    const total = yield medicalReport_model_1.default.countDocuments(reportQuery.queryModel.getFilter());
    return { data: result, total };
});
const getMedicalReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield medicalReport_model_1.default.findById(id)
        .select('-__v')
        .populate('doctor', '_id doctorTitle doctorType doctorCode name profileImg email currentWorkplace medicalDegree')
        .populate('patient', '_id name profileImg email gender weight dateOfBirth bloodGroup')
        .populate({
        path: 'appointment',
        select: '-createdAt -updatedAt -__v',
        populate: 'payment',
    });
    if (!report) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medical report not found');
    }
    return report;
});
exports.medicalReportService = {
    createMedicalReport,
    getAllMedicalReports,
    getMedicalReportById,
};
