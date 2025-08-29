import { Schema, model } from "mongoose";
import { TMessage } from "./message.interface";

const MessageSchema = new Schema<TMessage>(
  {
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
    repliedTo: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  { timestamps: true }
);

// Optional: Index for faster queries on chatId
MessageSchema.index({ chatId: 1, createdAt: 1 });

export const MessageModel = model<TMessage>("Message", MessageSchema);
