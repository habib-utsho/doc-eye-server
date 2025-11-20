import mongoose from 'mongoose'
import { ioServer } from './app'
import { Server } from 'http'


const PORT = Number(process.env.PORT || process.env.SOCKET_PORT || 3000)
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : undefined

const server: Server = ioServer.listen(PORT, HOST, async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log(`😀 Database connected at port ${process.env.PORT}`)
  } catch (error: any) {
    console.log(`😡 Failed to connect with db - ${error.message}`)
  }
})
// const server: Server = app.listen(process.env.PORT, async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI as string)
//     console.log(`😀 Database connected at port ${process.env.PORT}`)
//   } catch (error: any) {
//     console.log(`😡 Failed to connect with db - ${error.message}`)
//   }
// })

// stop server when async errors
process.on('unhandledRejection', () => {
  console.log('😡 UNHANDLED REJECTION! Shutting down...')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
})

// stop server when sync errors
process.on('uncaughtException', () => {
  console.log('😡 UNCAUGHT EXCEPTION! Shutting down...')
  process.exit(1)
})
