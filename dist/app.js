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
exports.ioServer = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const errHandler_1 = require("./app/middleware/errHandler");
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const message_model_1 = require("./app/module/message/message.model");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.ioServer = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});
// parser
const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://doc-eye.vercel.app",
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // console.log("Incoming Origin:", origin);
        // Allow requests from servers (no browser)
        if (!origin || origin === "null") {
            return callback(null, true);
        }
        // Allow frontend origins
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        // Block everything else
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
// socket.io connection
io.on("connection", (socket) => {
    // console.log("🔌 User connected:", socket.id);
    socket.on("join_room", (roomId) => {
        // console.log(`🔗 Joining room: ${roomId}`);
        socket.join(roomId);
    });
    socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { chatId, appointmentId, senderId, receiverId, text, from, messageType = "text" } = data;
        console.log(`📨 Message for appointment ${appointmentId}`);
        const messageForDB = {
            chatId, appointmentId, senderId, receiverId, text, from, messageType
        };
        try {
            const savedMessage = yield message_model_1.MessageModel.create(messageForDB);
            console.log({ savedMessage });
            io.to(appointmentId).emit("receive_message", savedMessage);
        }
        catch (err) {
            console.error("❌ Error saving message:", err);
        }
    }));
    socket.on("disconnect", () => {
        // console.log("❌ User disconnected:", socket.id);
    });
});
// Router
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('DocEye home route!');
}));
app.use('/api/v1', routes_1.default);
// app.use('/api/v1/students', studentRouter)
// app.use('/api/v1/users', userRoute)
// error handler
app.use(errHandler_1.notFoundErrHandler);
app.use(errHandler_1.globalErrHandler);
exports.default = app;
