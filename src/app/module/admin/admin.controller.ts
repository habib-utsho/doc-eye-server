import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { adminServices } from './admin.service'
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


const updateAdminById: RequestHandler = catchAsync(async (req, res) => {
  const { admin, accessToken, refreshToken } = await adminServices.updateAdminById(
    req.params?.id,
    req.file,
    req.body,
  )
  if (!admin) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Admin not updated!')
  }


  // const isProd = process.env.NODE_ENV === 'production';
  // const secure = isProd;
  // res.cookie('DErefreshToken', refreshToken, {
  //   httpOnly: true,
  //   secure,
  //   sameSite: isProd ? 'none' : 'lax',
  // });
  // res.cookie('DEaccessToken', accessToken, {
  //   httpOnly: true,
  //   secure,
  //   sameSite: isProd ? 'none' : 'lax',

  // });

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin updated successfully!',
    data: admin,
    accessToken,
    refreshToken,
  })
})

const deleteAdminById = catchAsync(async (req, res) => {
  const admin = await adminServices.deleteAdminById(req.params.id)
  if (!admin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Admin not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin is deleted successfully!',
    data: admin,
  })
})

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
}
