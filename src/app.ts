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
  console.log("🔌 User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    console.log(`🔗 Joining room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    const { appointmentId, ...rest } = data;
    console.log(`📨 Message for appointment ${appointmentId}`, rest);
    io.to(appointmentId).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
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
