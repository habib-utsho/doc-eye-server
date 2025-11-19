"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const review_validation_1 = require("./review.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
exports.reviewRouter = router;
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.PATIENT), (0, zodValidateHandler_1.default)(review_validation_1.reviewZodSchema.createReviewZodSchema), review_controller_1.reviewController.createReview);
router.get('/', review_controller_1.reviewController.getAllReview);
router.get('/:id', review_controller_1.reviewController.getReviewById);
