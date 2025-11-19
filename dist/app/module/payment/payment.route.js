"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRouter = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
// import zodValidateHandler from '../../middleware/zodValidateHandler'
const auth_1 = __importDefault(require("../../middleware/auth"));
// import { appointmentZodSchema } from '../appointment/appointment.validation'
const router = (0, express_1.Router)();
exports.paymentRouter = router;
router.get('/', (0, auth_1.default)('admin', 'doctor', 'patient'), payment_controller_1.paymentController.getAllPayment);
router.get('/:id', (0, auth_1.default)('admin'), payment_controller_1.paymentController.getPaymentById);
router.post('/', 
// zodValidateHandler(appointmentZodSchema.createAppointmentZodSchema),
payment_controller_1.paymentController.initPayment);
