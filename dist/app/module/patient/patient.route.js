"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const patient_controller_1 = require("./patient.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const patient_validation_1 = require("./patient.validation");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.patientRouter = router;
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), patient_controller_1.patientController.getAllPatients);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.PATIENT), patient_controller_1.patientController.getPatientById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.PATIENT, user_constant_1.USER_ROLE.ADMIN), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(patient_validation_1.updatePatientZodSchema), patient_controller_1.patientController.updatePatientById);
router.patch('/make-patient-admin/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), patient_controller_1.patientController.makePatientAdmin);
router.patch('/favorite-doctors', (0, auth_1.default)(user_constant_1.USER_ROLE.PATIENT), (0, zodValidateHandler_1.default)(patient_validation_1.favoriteDoctorParamsZodSchema), patient_controller_1.patientController.updateFavoriteDoctors);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), patient_controller_1.patientController.deletePatientById);
