import { StatusCodes } from "http-status-codes";
import AppError from "../../errors/appError";
import { MessageModel } from "./message.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { JwtPayload } from "jsonwebtoken";
import { TMessage } from "./message.interface";

const createMessage = async (payload: TMessage, user: JwtPayload) => {
  // Ensure senderId matches the logged-in user
  if (payload.senderId !== user._id) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to send this message"
    );
  }

  // Create and return message
  const message = await MessageModel.create({ ...payload });
  return message;
};

const getAllMessages = async (query: Record<string, unknown>) => {
  const messageQuery = new QueryBuilder(MessageModel.find(), {
    ...query,
    sort: `${query.sort || "createdAt"}`,
  })
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: "senderId", select: "_id name profileImg email" },
      { path: "receiverId", select: "_id name profileImg email" },
    ]);

  const result = await messageQuery.queryModel;
  const total = await MessageModel.countDocuments(
    messageQuery.queryModel.getFilter()
  );

  return { data: result, total };
};

const getMessageById = async (id: string) => {
  const message = await MessageModel.findById(id)
    .select("-__v")
    .populate("senderId", "_id name profileImg email")
    .populate("receiverId", "_id name profileImg email");

  if (!message) {
    throw new AppError(StatusCodes.NOT_FOUND, "Message not found");
  }

  return message;
};

export const messageService = {
  createMessage,
  getAllMessages,
  getMessageById,
};
