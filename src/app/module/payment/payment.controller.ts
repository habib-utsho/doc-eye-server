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
  const { data, total } = await paymentService.getAllPayment(req.query)

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

const updatePayment = catchAsync(async (req, res) => {
  const result = await paymentService.updatePayment(req.params?.id, req.body)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Payment is updated successfully',
    data: result,
  })
})

export const paymentController = {
  initPayment,
  updatePayment,
  getAllPayment,
  getPaymentById,
}
