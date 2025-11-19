"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = void 0;
const express_1 = require("express");
const message_controller_1 = require("./message.controller");
const zodValidateHandler_1 = __importDefault(require("../../middleware/zodValidateHandler"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const message_validation_1 = require("./message.validation");
const router = (0, express_1.Router)();
exports.messageRouter = router;
// Send a new message
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.PATIENT), (0, zodValidateHandler_1.default)(message_validation_1.messageZodSchema.createMessageZodSchema), message_controller_1.messageController.createMessage);
// Get all messages with pagination & filters
router.get("/", message_controller_1.messageController.getAllMessages);
// Get a single message by ID
router.get("/:id", message_controller_1.messageController.getMessageById);
