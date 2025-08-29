import { Router } from "express";
import { messageController } from "./message.controller";
import zodValidateHandler from "../../middleware/zodValidateHandler";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../user/user.constant";
import { messageZodSchema } from "./message.validation";

const router = Router();

// Send a new message
router.post(
    "/",
    auth(USER_ROLE.PATIENT),
    zodValidateHandler(messageZodSchema.createMessageZodSchema),
    messageController.createMessage
);

// Get all messages with pagination & filters
router.get("/", messageController.getAllMessages);

// Get a single message by ID
router.get("/:id", messageController.getMessageById);

export { router as messageRouter };
