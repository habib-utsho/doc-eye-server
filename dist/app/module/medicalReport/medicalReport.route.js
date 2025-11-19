"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.medicalReportRouter = void 0;
const express_1 = require("express");
const medicalReport_controller_1 = require("./medicalReport.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const medicalReport_validation_1 = require("./medicalReport.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
exports.medicalReportRouter = router;
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.DOCTOR), (0, zodValidateHandler_1.default)(medicalReport_validation_1.medicalReportZodSchema.createMedicalReportZodSchema), medicalReport_controller_1.medicalReportController.createMedicalReport);
router.get('/', medicalReport_controller_1.medicalReportController.getAllMedicalReports);
router.get('/:id', medicalReport_controller_1.medicalReportController.getMedicalReportById);
