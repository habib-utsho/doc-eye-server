"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRouter = void 0;
const express_1 = require("express");
const appointment_controller_1 = require("./appointment.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const appointment_validation_1 = require("./appointment.validation");
const router = (0, express_1.Router)();
exports.appointmentRouter = router;
router.post('/', (0, zodValidateHandler_1.default)(appointment_validation_1.appointmentZodSchema.createAppointmentZodSchema), appointment_controller_1.appointmentController.createAppointment);
