"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const auth_validation_1 = require("./auth.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
exports.authRouter = router;
router.post("/login", (0, zodValidateHandler_1.default)(auth_validation_1.authZodSchema.signinZodSchema), auth_controller_1.authControllers.login);
router.post("/refresh-token", auth_controller_1.authControllers.refreshToken);
router.post("/forget-password", (0, zodValidateHandler_1.default)(auth_validation_1.authZodSchema.forgetPasswordZodSchema), auth_controller_1.authControllers.forgetPassword);
router.post("/reset-password", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.PATIENT, user_constant_1.USER_ROLE.PATIENT), (0, zodValidateHandler_1.default)(auth_validation_1.authZodSchema.resetPasswordZodSchema), auth_controller_1.authControllers.resetPassword);
router.patch("/change-password", (0, zodValidateHandler_1.default)(auth_validation_1.authZodSchema.changePasswordZodSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.DOCTOR, user_constant_1.USER_ROLE.PATIENT), auth_controller_1.authControllers.changePassword);
