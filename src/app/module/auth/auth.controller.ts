import { StatusCodes } from 'http-status-codes'
import { CookieOptions } from 'express'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { authServices } from './auth.service'
import AppError from '../../errors/appError'
import { JwtPayload } from 'jsonwebtoken'

const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken, needsPasswordChange } =
    await authServices.login(req.body)
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('DEaccessToken');
  res.clearCookie('DErefreshToken');

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  // Set both new tokens
  res.cookie('DEaccessToken', accessToken, { ...cookieOptions, maxAge: 15 * 24 * 60 * 60 * 1000 }); // 15 days for access token
  res.cookie('DErefreshToken', refreshToken, { ...cookieOptions, maxAge: 35 * 24 * 60 * 60 * 1000 }); // 35 days for refresh token

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'User is logged in successfully',
    data: { accessToken, refreshToken, needsPasswordChange },
  })
})
const refreshToken = catchAsync(async (req, res) => {
  const { DErefreshToken } = req.body || req.cookies || {}
  if (!DErefreshToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Refresh token is required')
  }

  const result = await authServices.refreshToken(DErefreshToken)


  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  };

  // Set both new tokens
  res.cookie('DEaccessToken', result.accessToken, { ...cookieOptions, maxAge: 15 * 24 * 60 * 60 * 1000 }); // 15 days for access token
  res.cookie('DErefreshToken', result.refreshToken, { ...cookieOptions, maxAge: 35 * 24 * 60 * 60 * 1000 }); // 35 days for refresh token

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Access token is retrieved successfully',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const result = await authServices.forgetPassword(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message:
      'Reset your password within 10 minutes! Check your email for the reset link and also check the spam folder.',
    data: result,
  })
})
const resetPassword = catchAsync(async (req, res) => {
  const result = await authServices.resetPassword(
    req.body,
    req.user as JwtPayload,
  )

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Password is reset successfully!',
    data: result,
  })
})

const changePassword = catchAsync(async (req, res) => {
  const user = await authServices.changePassword(
    req.user as JwtPayload,
    req.body,
  )

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found')
  }

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Password is updated successfully!',
    data: user,
  })
})

export const authControllers = {
  login,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
}
