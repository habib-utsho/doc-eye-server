import { z } from "zod";

const createMessageZodSchema = z.object({
  chatId: z.string({
    required_error: "Chat ID is required",
  }),
  senderId: z.string({
    required_error: "Sender ID is required",
  }),
  from: z.enum(["doctor", "patient"], {
    required_error: "From is required",
  }),
  receiverId: z.string({
    required_error: "Receiver ID is required",
  }),
  messageType: z.enum(["text", "image", "video"], {
    required_error: "Message type is required",
  }),
  text: z.string().optional(),
  mediaUrl: z.string().url().optional(),
  repliedTo: z.string().optional(),
});

export const messageZodSchema = {
  createMessageZodSchema,
};
