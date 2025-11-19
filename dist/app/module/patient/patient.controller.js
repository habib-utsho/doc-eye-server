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
exports.patientController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const patient_service_1 = require("./patient.service"); // Change to patientServices
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const getAllPatients = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield patient_service_1.patientServices.getAllPatients(req.query); // Change to getAllPatients
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Patients are retrieved successfully!', // Update message
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getPatientById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const patient = yield patient_service_1.patientServices.getPatientById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id); // Change to getPatientById
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Patient is retrieved successfully!', // Update message
        data: patient,
    });
}));
const updateFavoriteDoctors = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const { doctorId } = req.body;
    const patient = yield patient_service_1.patientServices.updateFavoriteDoctors(patientId, doctorId);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: patient.message,
        data: patient.patient,
    });
}));
const makePatientAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const admin = yield patient_service_1.patientServices.makePatientAdmin((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!admin) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Patient not updated!'); // Update message
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Patient promoted to admin successfully', // Update message
        data: admin,
    });
}));
const updatePatientById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { patient, accessToken, refreshToken } = yield patient_service_1.patientServices.updatePatientById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.file, req.body);
    if (!patient) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Patient not updated!'); // Update message
    }
    const isProd = process.env.NODE_ENV === 'production';
    const secure = isProd;
    res.cookie('DErefreshToken', refreshToken, {
        httpOnly: true,
        secure,
        sameSite: isProd ? 'none' : 'lax',
    });
    res.cookie('DEaccessToken', accessToken, {
        httpOnly: true,
        secure,
        sameSite: isProd ? 'none' : 'lax',
    });
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Patient updated successfully!', // Update message
        data: patient,
    });
}));
const deletePatientById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_service_1.patientServices.deletePatientById(req.params.id); // Change to deletePatientById
    if (!patient) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Patient not found!'); // Update message
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Patient is deleted successfully!', // Update message
        data: patient,
    });
}));
exports.patientController = {
    getAllPatients,
    getPatientById,
    makePatientAdmin,
    updatePatientById,
    deletePatientById,
    updateFavoriteDoctors
};
