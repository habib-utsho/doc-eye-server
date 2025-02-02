import { RequestHandler } from 'express'

import sendResponse from '../../utils/sendResponse'
import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'
import { userServices } from './user.service'
import { JwtPayload } from 'jsonwebtoken'

const insertPatient: RequestHandler = catchAsync(async (req, res) => {
  console.log('insertPatient')
  const patient = await userServices.insertPatient(req.file, req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Patient created successfully!',
    data: patient,
  })
})

const insertDoctor: RequestHandler = catchAsync(async (req, res) => {
  const faculty = await userServices.insertDoctor(req.file, req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message:
      'Doctor created successfully. Wait for admin approval. You will be notified via email!',
    data: faculty,
  })
})
const insertAdmin: RequestHandler = catchAsync(async (req, res) => {
  const admin = await userServices.insertAdmin(req.file, req.body)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin created successfully!',
    data: admin,
  })
})

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const users = await userServices.getAllUser()
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Users are retrieved successfully!',
    data: users,
  })
})

const getUserById: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.getSingleUserById(req.params?.id)
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'User is retrieved successfully!',
    data: user,
  })
})
const toggleUserStatus: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.toggleUserStatus(req.params?.id)
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: `User is ${user.status} successfully!`,
    data: user,
  })
})

const getMe: RequestHandler = catchAsync(async (req, res) => {
  const user = await userServices.getMe(req.user as JwtPayload)
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'User is retrieved successfully!',
    data: user,
  })
})

export const userController = {
  insertPatient,
  insertDoctor,
  insertAdmin,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  getMe,
}
