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
const admin_service_1 = require("./admin.service"); // Change to adminServices
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
    var _a;
    const admin = yield admin_service_1.adminServices.getAdminById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Admin is retrieved successfully!',
        data: admin,
    });
}));
// const updateAdminById: RequestHandler = catchAsync(async (req, res) => {
//   const admin = await adminServices.updateAdminById( // Change to adminServices.updateAdminById
//     req.params?.id,
//     req.body,
//   )
//   if (!admin) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Admin not updated!') // Update message
//   }
//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: 'Admin updated successfully!', // Update message
//     data: admin,
//   })
// })
const deleteAdminById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_service_1.adminServices.deleteAdminById(req.params.id);
    if (!admin) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Admin not found!'); // Update message
    }
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Admin is deleted successfully!', // Update message
        data: admin,
    });
}));
exports.adminController = {
    // Change export name to adminController
    getAllAdmins, // Change to getAllAdmins
    getAdminById, // Change to getAdminById
    // updateAdminById, // Change to updateAdminById
    deleteAdminById, // Change to deleteAdminById
};
