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
// const updatePatientById: RequestHandler = catchAsync(async (req, res) => {
//   const patient = await patientServices.updatePatientById( // Change to patientServices.updatePatientById
//     req.params?.id,
//     req.body,
//   )
//   if (!patient) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Patient not updated!') // Update message
//   }
//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: 'Patient updated successfully!', // Update message
//     data: patient,
//   })
// })
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
    // Change export name to patientController
    getAllPatients, // Change to getAllPatients
    getPatientById, // Change to getPatientById
    // updatePatientById, // Change to updatePatientById
    deletePatientById, // Change to deletePatientById
};
