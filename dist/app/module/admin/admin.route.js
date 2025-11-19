"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const admin_controller_1 = require("./admin.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const admin_validation_1 = require("./admin.validation");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const router = (0, express_1.Router)();
exports.adminRouter = router;
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.adminController.getAllAdmins);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.adminController.getAdminById);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), uploadImgToCloudinary_1.upload.single('file'), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req.body) === null || _a === void 0 ? void 0 : _a.data);
    next();
}, (0, zodValidateHandler_1.default)(admin_validation_1.updateAdminZodSchema), admin_controller_1.adminController.updateAdminById);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), admin_controller_1.adminController.deleteAdminById);
