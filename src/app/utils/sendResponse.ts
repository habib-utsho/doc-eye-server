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
    collection?: string
  },
) => {
  res.status(statusCode).send({
    success: format?.success,
    message: format?.message,
    data: format?.data || null,
    meta: format?.meta || null,
    ...(format?.accessToken ? { accessToken: format.accessToken }
      : {}),
    ...(format?.refreshToken ? { refreshToken: format.refreshToken }
      : {}),
    ...(format?.collection ? { collection: format.collection }
      : {}),
  })
}

export default sendResponse
