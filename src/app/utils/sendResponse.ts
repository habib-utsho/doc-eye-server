import { Response } from 'express'

const sendResponse = (
  res: Response,
  statusCode: number,
  format: {
    success: boolean
    message: string
    data: any
    accessToken?: string
    refreshToken?: string
    meta?: { total: number; page: number; totalPage: number; limit: number }
  },
) => {
  res.status(statusCode).send({
    success: format?.success,
    message: format?.message,
    data: format?.data || null,
    meta: format?.meta || null,
    accessToken: format?.accessToken || null,
    refreshToken: format?.refreshToken || null,
  })
}

export default sendResponse
