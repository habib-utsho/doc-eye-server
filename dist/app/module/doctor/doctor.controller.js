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
exports.doctorController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const doctor_service_1 = require("./doctor.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const getAllDoctor = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield doctor_service_1.doctorServices.getAllDoctor(req.query);
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Doctors are retrieved successfully!',
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getDoctorById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doctor = yield doctor_service_1.doctorServices.getDoctorById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Doctor is retrieved successfully!',
        data: doctor,
    });
}));
// const updateStudentById: RequestHandler = catchAsync(async (req, res) => {
//   const student = await doctorServices.updateStudentById(
//     req.params?.id,
//     req.body,
//   )
//   if (!student) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Student not updated!')
//   }
//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: 'Student updated successfully!',
//     data: student,
//   })
// })
const deleteDoctorById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_service_1.doctorServices.deleteDoctorById(req.params.id);
    if (!doctor) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Doctor not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Doctor is deleted successfully!',
        data: doctor,
    });
}));
exports.doctorController = {
    getAllDoctor,
    getDoctorById,
    // updateDoctorById,
    deleteDoctorById,
};
