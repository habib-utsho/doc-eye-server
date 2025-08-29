import { Types } from "mongoose";

export type TMessage = {
  chatId: string; // One-to-one or group chat ID
  from: string;
  senderId: string;
  receiverId: string;
  messageType: "text" | "image" | "video";
  text?: string;
  mediaUrl?: string;
  isRead: boolean;
  isDelivered: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  repliedTo?: Types.ObjectId; // Reference to another message
  createdAt: Date;
  updatedAt: Date;
}
