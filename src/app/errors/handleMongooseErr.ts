import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { TErrorSources, TGenericErrorResponse } from '../interface/error'

const handleMongooseValidationErr = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const statusCode = StatusCodes.BAD_REQUEST
  const message = 'Validation error!'
  const errorSources: TErrorSources = Object.keys(err.errors).map((key) => {
    return {
      path: key,
      message: err.errors[key]?.message,
    }
  })

  return {
    statusCode,
    message,
    errorSources,
  }
}

const handleMongooseCastErr = (
  err: mongoose.Error.CastError,
): TGenericErrorResponse => {
  const statusCode = StatusCodes.BAD_REQUEST
  const message = 'Cast error!'
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ]

  return {
    statusCode,
    message,
    errorSources,
  }
}

const handleMongooseDuplicateKeyErr = (err: any): TGenericErrorResponse => {
  const statusCode = StatusCodes.BAD_REQUEST
  const message = 'Duplicate key error!'
  const errorSources: TErrorSources = [
    {
      path: Object.keys(err.keyValue)?.[0],
      message: `${Object.values(err.keyValue)?.[0]} is already exist!`,
    },
  ]

  return {
    statusCode,
    message,
    errorSources,
  }
}

export { handleMongooseValidationErr, handleMongooseCastErr, handleMongooseDuplicateKeyErr }
