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
exports.specialtyController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const specialty_service_1 = require("./specialty.service");
const appError_1 = __importDefault(require("../../errors/appError"));
const createSpecialty = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield specialty_service_1.specialtyService.createSpecialty(req.file, req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Specialty is created successfully',
        data: result,
    });
}));
const getAllSpecialties = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield specialty_service_1.specialtyService.getAllSpecialty(req.query);
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Specialties are retrieved successfully!',
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getSpecialtyById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const specialty = yield specialty_service_1.specialtyService.getSpecialtyById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Specialty is retrieved successfully!',
        data: specialty,
    });
}));
const updateSpecialtyById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const specialty = yield specialty_service_1.specialtyService.updateSpecialtyById(req.file, (_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.body);
    if (!specialty) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Specialty not updated!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Specialty updated successfully!',
        data: specialty,
    });
}));
const deleteSpecialtyById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialty = yield specialty_service_1.specialtyService.deleteSpecialtyById(req.params.id);
    if (!specialty) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Specialty not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Specialty is deleted successfully!',
        data: specialty,
    });
}));
exports.specialtyController = {
    createSpecialty,
    getAllSpecialties,
    getSpecialtyById,
    updateSpecialtyById,
    deleteSpecialtyById,
};
