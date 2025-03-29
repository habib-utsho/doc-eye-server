import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { reviewService } from './review.service'
import { RequestHandler } from 'express'
import { JwtPayload } from 'jsonwebtoken'

const createReview = catchAsync(async (req, res) => {
  const review = await reviewService.createReview(req.body, req.user as JwtPayload)

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Review created successfully!',
    data: review,
  })
})
const getAllReview = catchAsync(async (req, res) => {
  const { data, total } = await reviewService.getAllReview(req.query)

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Reviews are retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getReviewById: RequestHandler = catchAsync(async (req, res) => {
  const appointment = await reviewService.getReviewById(
    req.params?.id,
  )
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Review is retrieved successfully!',
    data: appointment,
  })
})

export const reviewController = {
  createReview,
  getAllReview,
  getReviewById,
}
