"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    chatId: { type: String, required: true, index: true },
    from: { type: String, required: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    messageType: {
        type: String,
        enum: ["text", "image", "video"],
        default: "text",
    },
    text: { type: String },
    mediaUrl: { type: String },
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    repliedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });
// Optional: Index for faster queries on chatId
MessageSchema.index({ chatId: 1, createdAt: 1 });
exports.MessageModel = (0, mongoose_1.model)("Message", MessageSchema);
