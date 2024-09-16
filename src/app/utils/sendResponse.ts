import { Response } from 'express'

const sendResponse = (
  res: Response,
  statusCode: number,
  format: {
    success: boolean
    message: string
    data: any
    meta?: { total: number; page: number; totalPage: number; limit: number }
  },
) => {
  res.status(statusCode).send({
    success: format?.success,
    message: format?.message,
    data: format?.data || null,
    meta: format?.meta || null,
  })
}

export default sendResponse
