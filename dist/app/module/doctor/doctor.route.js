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
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const doctor_validation_1 = require("./doctor.validation");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.doctorRouter = router;
router.get('/', doctor_controller_1.doctorController.getAllDoctor);
router.get('/:id', doctor_controller_1.doctorController.getDoctorById);
router.get('/doctor-code/:id', doctor_controller_1.doctorController.getDoctorByDoctorCode);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.DOCTOR), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(doctor_validation_1.updateDoctorZodSchema), doctor_controller_1.doctorController.updateDoctorById);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), doctor_controller_1.doctorController.deleteDoctorById);
