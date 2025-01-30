import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import {
  globalErrHandler,
  notFoundErrHandler,
} from './app/middleware/errHandler'
import router from './app/routes'
import cookieParser from 'cookie-parser'

const app = express()

app.get('/', async (req, res) => {
  res.send('DocEye home route!')
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

// Router
app.use('/api/v1', router)
// app.use('/api/v1/students', studentRouter)
// app.use('/api/v1/users', userRoute)

// error handler
app.use(notFoundErrHandler)
app.use(globalErrHandler)

export default app
