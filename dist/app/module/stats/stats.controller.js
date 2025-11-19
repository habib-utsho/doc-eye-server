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
exports.statsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const stats_service_1 = require("./stats.service");
const appError_1 = __importDefault(require("../../errors/appError"));
const getPatientStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pPatient = req === null || req === void 0 ? void 0 : req.user;
    if (!pPatient) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to access this route');
    }
    const data = yield stats_service_1.statsService.getPatientStats(pPatient);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Patient stats retrieved successfully',
        data,
    });
}));
const getDoctorStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pDoctor = req === null || req === void 0 ? void 0 : req.user;
    if (!pDoctor) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to access this route');
    }
    const data = yield stats_service_1.statsService.getDoctorStats(pDoctor);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Doctor stats retrieved successfully',
        data,
    });
}));
const getAdminStats = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pAdmin = req === null || req === void 0 ? void 0 : req.user;
    if (!pAdmin) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to access this route');
    }
    const data = yield stats_service_1.statsService.getAdminStats(pAdmin);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Admin stats retrieved successfully',
        data,
    });
}));
exports.statsController = {
    getPatientStats, getDoctorStats, getAdminStats
};
