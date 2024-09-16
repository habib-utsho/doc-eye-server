import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'
import { TErrorSources } from '../interface/error'
import mongoose from 'mongoose'
import handleZodErr from '../errors/handleZodErr'
import {
  handleMongooseCastErr,
  handleMongooseDuplicateKeyErr,
  handleMongooseValidationErr,
} from '../errors/handleMongooseErr'

const notFoundErrHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res
    .status(StatusCodes.NOT_FOUND)
    .send({ success: false, message: error?.message, error: error })
}

const globalErrHandler: ErrorRequestHandler = (err, req, res, next) => {

  // Default values
  let statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  let message = err.message || 'Internal server error'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Internal server error',
    },
  ]

  //   zod error
  if (err instanceof ZodError) {
    const ourErr = handleZodErr(err)
    message = ourErr.message
    statusCode = ourErr.statusCode
    errorSources = ourErr.errorSources
  }

  // mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const ourErr = handleMongooseValidationErr(err)

    message = ourErr.message
    statusCode = ourErr.statusCode
    errorSources = ourErr.errorSources
  }
  //   Cast error
  if (err instanceof mongoose.Error.CastError) {
    const ourErr = handleMongooseCastErr(err)

    message = ourErr.message
    statusCode = ourErr.statusCode
    errorSources = ourErr.errorSources
  }

  // Duplicate key err
  if (err?.code === 11000) {
    const ourErr = handleMongooseDuplicateKeyErr(err)

    message = ourErr.message
    statusCode = ourErr.statusCode
    errorSources = ourErr.errorSources
  }


  // Send response
  res.status(statusCode).send({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err?.stack,
  })
}

export { notFoundErrHandler, globalErrHandler }
