"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter2 = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const payment_validate_1 = require("./payment.validate");
const router = (0, express_1.Router)();
exports.paymentRouter2 = router;
router.post('/init', (0, zodValidateHandler_1.default)(payment_validate_1.paymentZodSchema.initPaymentZodSchema), payment_controller_1.paymentControllers.initPayment);
router.post('/failed', payment_controller_1.paymentControllers.failedPayment);
