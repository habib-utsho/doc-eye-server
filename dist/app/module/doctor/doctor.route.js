"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const doctor_controller_1 = require("./doctor.controller");
const router = (0, express_1.Router)();
exports.doctorRouter = router;
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), doctor_controller_1.doctorController.getAllDoctor);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), doctor_controller_1.doctorController.getDoctorById);
// router.patch(
//   '/:id',
//   auth(USER_ROLE.ADMIN),
//   zodValidateHandler(updateStudentZodSchema),
//   studentController.updateStudentById,
// )
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), doctor_controller_1.doctorController.deleteDoctorById);
