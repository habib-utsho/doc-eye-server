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
exports.paymentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Cast req.query to the expected payment payload type (use a proper type instead of `any` if available)
    const result = yield payment_service_1.paymentService.initPayment(req.query);
    // sendResponse(res, StatusCodes.OK, {
    //   success: true,
    //   message: 'Payment success and appointment is confirmed!',
    //   data: result,
    // })
    return res.redirect(`http://localhost:3000/doctor/${(_a = req.query) === null || _a === void 0 ? void 0 : _a.doctorCode}/checkout/success?transactionId=${(_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.trans_id}&appointmentId=${result.appointment._id}`);
}));
const getAllPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    if (!req.user) {
        (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.UNAUTHORIZED, {
            success: false,
            message: 'You are not authorized to access this route',
            data: null,
        });
        return;
    }
    const { data, total } = yield payment_service_1.paymentService.getAllPayment(req.query, req.user);
    const page = ((_c = req.query) === null || _c === void 0 ? void 0 : _c.page) ? Number(req.query.page) : 1;
    const limit = ((_d = req.query) === null || _d === void 0 ? void 0 : _d.limit) ? Number(req.query.limit) : 10;
    const totalPage = Math.ceil(total / limit);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Payments are retrieved successfully!',
        data,
        meta: { total, page, totalPage, limit },
    });
}));
const getPaymentById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const patient = yield payment_service_1.paymentService.getPaymentById((_e = req.params) === null || _e === void 0 ? void 0 : _e.id);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Payment is retrieved successfully!',
        data: patient,
    });
}));
exports.paymentController = {
    initPayment,
    getAllPayment,
    getPaymentById,
};
