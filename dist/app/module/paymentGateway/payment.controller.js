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
exports.paymentControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield payment_service_1.paymentServices.initPayment(req.body);
    (0, sendResponse_1.default)(res, http_status_codes_1.StatusCodes.OK, {
        success: true,
        message: 'Redirected to the payment page!',
        data: data,
    });
}));
const failedPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const queryParams = req.query;
    Object.keys(queryParams).forEach(key => {
        if (!queryParams[key]) {
            delete queryParams[key];
        }
    });
    const queryString = new URLSearchParams(queryParams).toString();
    ;
    return res.redirect(`${process.env.CLIENT_URL}/doctor/${(_a = req.query) === null || _a === void 0 ? void 0 : _a.doctorCode}/checkout/failed?${queryString}`);
}));
exports.paymentControllers = {
    initPayment,
    failedPayment
};
