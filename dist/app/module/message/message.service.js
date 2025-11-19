"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const message_model_1 = require("./message.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createMessage = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure senderId matches the logged-in user
    if (payload.senderId !== user._id) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized to send this message");
    }
    // Create and return message
    const message = yield message_model_1.MessageModel.create(Object.assign({}, payload));
    return message;
});
const getAllMessages = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const messageQuery = new QueryBuilder_1.default(message_model_1.MessageModel.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort || "createdAt"}` }))
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: "senderId", select: "_id name profileImg email" },
        { path: "receiverId", select: "_id name profileImg email" },
    ]);
    const result = yield messageQuery.queryModel;
    const total = yield message_model_1.MessageModel.countDocuments(messageQuery.queryModel.getFilter());
    return { data: result, total };
});
const getMessageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield message_model_1.MessageModel.findById(id)
        .select("-__v")
        .populate("senderId", "_id name profileImg email")
        .populate("receiverId", "_id name profileImg email");
    if (!message) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Message not found");
    }
    return message;
});
exports.messageService = {
    createMessage,
    getAllMessages,
    getMessageById,
};
