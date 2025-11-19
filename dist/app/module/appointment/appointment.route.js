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
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = (0, express_1.Router)();
exports.appointmentRouter = router;
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.DOCTOR, user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.PATIENT), appointment_controller_1.appointmentController.getAllAppointment);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.DOCTOR, user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.PATIENT), appointment_controller_1.appointmentController.getAppointmentById);
router.patch('/update-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.DOCTOR, user_constant_1.USER_ROLE.ADMIN), (0, zodValidateHandler_1.default)(appointment_validation_1.appointmentZodSchema.updateAppointmentStatusZodSchema), appointment_controller_1.appointmentController.updateAppointmentStatusById);
