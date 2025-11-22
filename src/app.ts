import http from 'http'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import {
  globalErrHandler,
  notFoundErrHandler,
} from './app/middleware/errHandler'
import router from './app/routes'
import cookieParser from 'cookie-parser'
import { Server } from "socket.io"
import { MessageModel } from './app/module/message/message.model'
import cron from "node-cron"
import axios from 'axios'

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})

// Create an axios instance with a longer timeout
const axiosInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
})


// Schedule the self-ping every 10 minutes (you can adjust the frequency)
cron.schedule('*/10 * * * *', () => {
  axiosInstance
    .get(process.env.SERVER_URL as string)
    .then((response) => {
      console.log('😀🎉 Self-ping successful:', response.status)
    })
    .catch((error) => {
      console.error('😡 Self-ping failed:', error.message)
    })
})



// Add gateway domains
const PAYMENT_GATEWAY_ORIGINS = [
  'https://sandbox.aamarpay.com',
  'https://secure.aamarpay.com',
];
// parser
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://doc-eye.vercel.app',
  'https://doc-eye-client.onrender.com',
  process.env.CLIENT_URL,
  process.env.SERVER_URL,
  ...PAYMENT_GATEWAY_ORIGINS,
].filter(Boolean);


app.use(
  cors({
    origin: (origin, callback) => {
      const requestPath = (typeof origin === 'string') ? origin : '';

      // Allow server-to-server / missing origin
      if (!origin) return callback(null, true);

      // Permit payment callback hits even if origin is gateway
      if (PAYMENT_GATEWAY_ORIGINS.includes(origin)) return callback(null, true);

      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }),
)


app.use(cookieParser())
app.use(express.json())


// socket.io connection
io.on("connection", (socket) => {
  // console.log("🔌 User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    // console.log(`🔗 Joining room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on("send_message", async (data) => {
    const { chatId, appointmentId, senderId, receiverId, text, from, messageType = "text" } = data;
    console.log(`📨 Message for appointment ${appointmentId}`);

    const messageForDB = {
      chatId, appointmentId, senderId, receiverId, text, from, messageType
    }

    try {

      const savedMessage = await MessageModel.create(messageForDB);
      console.log({ savedMessage });
      io.to(appointmentId).emit("receive_message", savedMessage);
    } catch (err: any) {
      console.error("❌ Error saving message:", err);
    }

  });

  socket.on("disconnect", () => {
    // console.log("❌ User disconnected:", socket.id);
  });
});



// Router
app.get('/', async (req, res) => {
  res.send('DocEye home route!!!')
})

app.use('/api/v1', router)
// app.use('/api/v1/students', studentRouter)
// app.use('/api/v1/users', userRoute)

// error handler
app.use(notFoundErrHandler)
app.use(globalErrHandler)


// // socket server error handling
// // server.listen(process.env.SOCKET_PORT || 5500, () => {
// const PORT = Number(process.env.SOCKET_PORT) || 3000;  // Render sets PORT dynamically (e.g., 10000)
// server.listen(PORT, '0.0.0.0', () => {  // Add '0.0.0.0' for Render proxy
//   console.log(`Socket server is running on port ${PORT}`);
// })


export { server as ioServer };
export default app
