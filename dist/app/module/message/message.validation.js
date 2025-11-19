"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageZodSchema = void 0;
const zod_1 = require("zod");
const createMessageZodSchema = zod_1.z.object({
    chatId: zod_1.z.string({
        required_error: "Chat ID is required",
    }),
    senderId: zod_1.z.string({
        required_error: "Sender ID is required",
    }),
    from: zod_1.z.enum(["doctor", "patient"], {
        required_error: "From is required",
    }),
    receiverId: zod_1.z.string({
        required_error: "Receiver ID is required",
    }),
    messageType: zod_1.z.enum(["text", "image", "video"], {
        required_error: "Message type is required",
    }),
    text: zod_1.z.string().optional(),
    mediaUrl: zod_1.z.string().url().optional(),
    repliedTo: zod_1.z.string().optional(),
});
exports.messageZodSchema = {
    createMessageZodSchema,
};
