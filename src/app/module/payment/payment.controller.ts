import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { paymentService } from './payment.service'
import { RequestHandler } from 'express'

const initPayment = catchAsync(async (req, res) => {
  const result = await paymentService.initPayment(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Payment success and appointment is confirmed!',
    data: result,
  })
})

const getAllPayment = catchAsync(async (req, res) => {
  if (!req.user) {
    sendResponse(res, StatusCodes.UNAUTHORIZED, {
      success: false,
      message: 'You are not authorized to access this route',
      data: null,
    })
    return
  }
  const { data, total } = await paymentService.getAllPayment(
    req.query,
    req.user,
  )

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Payments are retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})
const getPaymentById: RequestHandler = catchAsync(async (req, res) => {
  const patient = await paymentService.getPaymentById(req.params?.id)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Payment is retrieved successfully!',
    data: patient,
  })
})



export const paymentController = {
  initPayment,
  getAllPayment,
  getPaymentById,
}
