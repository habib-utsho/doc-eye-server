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
exports.appointmentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const appointment_service_1 = require("./appointment.service");
const getAllAppointment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield appointment_service_1.appointmentService.getAllAppointments(req.query);
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Appointments are retrieved successfully!',
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getAppointmentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const appointment = yield appointment_service_1.appointmentService.getAppointmentById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Appointment is retrieved successfully!',
        data: appointment,
    });
}));
const updateAppointmentStatusById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield appointment_service_1.appointmentService.updateAppointmentStatusById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Appointment is updated successfully',
        data: result,
    });
}));
exports.appointmentController = {
    getAllAppointment,
    getAppointmentById,
    updateAppointmentStatusById,
};
