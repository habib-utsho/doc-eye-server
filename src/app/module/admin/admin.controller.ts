import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { adminServices } from './admin.service' // Change to adminServices
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'

const getAllAdmins: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await adminServices.getAllAdmins(req.query)

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admins are retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getAdminById: RequestHandler = catchAsync(async (req, res) => {
  const admin = await adminServices.getAdminById(req.params?.id)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin is retrieved successfully!',
    data: admin,
  })
})


// const updateAdminById: RequestHandler = catchAsync(async (req, res) => {
//   const admin = await adminServices.updateAdminById( // Change to adminServices.updateAdminById
//     req.params?.id,
//     req.body,
//   )
//   if (!admin) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Admin not updated!') // Update message
//   }
//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: 'Admin updated successfully!', // Update message
//     data: admin,
//   })
// })

const deleteAdminById = catchAsync(async (req, res) => {
  const admin = await adminServices.deleteAdminById(req.params.id)
  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found!') // Update message
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin is deleted successfully!', // Update message
    data: admin,
  })
})

export const adminController = {
  // Change export name to adminController
  getAllAdmins, // Change to getAllAdmins
  getAdminById, // Change to getAdminById
  // updateAdminById, // Change to updateAdminById
  deleteAdminById, // Change to deleteAdminById
}
