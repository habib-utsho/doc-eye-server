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
exports.adminController = void 0;
const http_status_codes_1 = require("http-status-codes");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const admin_service_1 = require("./admin.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../errors/appError"));
const getAllAdmins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { data, total } = yield admin_service_1.adminServices.getAllAdmins(req.query);
    const page = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.page) ? Number(req.query.page) : 1;
    const limit = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Admins are retrieved successfully!', // Update message
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const admin = yield admin_service_1.adminServices.getAdminById((_c = req.params) === null || _c === void 0 ? void 0 : _c.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Admin is retrieved successfully!',
        data: admin,
    });
}));
const updateAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { admin, accessToken, refreshToken } = yield admin_service_1.adminServices.updateAdminById((_d = req.params) === null || _d === void 0 ? void 0 : _d.id, req.file, req.body);
    if (!admin) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Admin not updated!');
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
        message: 'Admin updated successfully!',
        data: admin,
    });
}));
const deleteAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_service_1.adminServices.deleteAdminById(req.params.id);
    if (!admin) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Admin not found!');
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Admin is deleted successfully!',
        data: admin,
    });
}));
exports.adminController = {
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
};
