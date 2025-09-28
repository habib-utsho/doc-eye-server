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

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  }
})



// parser
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true)
      return callback(null, origin)
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
    const { chatId, appointmentId, senderId, receiverId, timestamp, text, from, messageType = "text" } = data;
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
  res.send('DocEye home route!')
})

app.use('/api/v1', router)
// app.use('/api/v1/students', studentRouter)
// app.use('/api/v1/users', userRoute)

// error handler
app.use(notFoundErrHandler)
app.use(globalErrHandler)


// socket server error handling
server.listen(process.env.SOCKET_PORT || 5500, () => {
  console.log(`Socket server is running on port ${process.env.SOCKET_PORT || 5500}`);
})

export default app
