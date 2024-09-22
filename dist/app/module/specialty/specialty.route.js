"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtyRouter = void 0;
const express_1 = require("express");
const specialty_controller_1 = require("./specialty.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const specialty_validation_1 = require("./specialty.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.specialtyRouter = router;
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(specialty_validation_1.specialtyZodSchema.createSpecialtyZodSchema), specialty_controller_1.specialtyController.createSpecialty);
router.get('/', specialty_controller_1.specialtyController.getAllSpecialties);
router.get('/:id', specialty_controller_1.specialtyController.getSpecialtyById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a, _b;
    if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.data) {
        req.body = JSON.parse((_b = req.body) === null || _b === void 0 ? void 0 : _b.data);
    }
    next();
}, (0, zodValidateHandler_1.default)(specialty_validation_1.specialtyZodSchema.updateSpecialtyZodSchema), specialty_controller_1.specialtyController.updateSpecialtyById);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), specialty_controller_1.specialtyController.deleteSpecialtyById);
router.delete('/:id', specialty_controller_1.specialtyController.deleteSpecialtyById);
