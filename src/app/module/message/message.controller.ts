import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { messageService } from "./message.service";
import { RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";

const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(
    req.body,
    req.user as JwtPayload
  );

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: "Message sent successfully!",
    data: message,
  });
});

const getAllMessages = catchAsync(async (req, res) => {
  const { data, total } = await messageService.getAllMessages(req.query);

  const page = req.query?.page ? Number(req.query.page) : 1;
  const limit = req.query?.limit ? Number(req.query.limit) : 10;
  const totalPage = Math.ceil(total / limit);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Messages retrieved successfully!",
    data,
    meta: { total, page, totalPage, limit },
  });
});

const getMessageById: RequestHandler = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.params?.id);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: "Message retrieved successfully!",
    data: message,
  });
});

export const messageController = {
  createMessage,
  getAllMessages,
  getMessageById,
};
