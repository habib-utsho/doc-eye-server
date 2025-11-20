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
  const origin = req.headers.origin || '';
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction && !isLocalhost,     // false for localhost
    sameSite: ((isProduction && !isLocalhost) ? 'none' : 'lax') as CookieOptions['sameSite'],  // 'lax' for localhost
  };

  res.cookie('DEaccessToken', accessToken, cookieOptions);
  res.cookie('DErefreshToken', refreshToken, cookieOptions);

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
  const origin = req.headers.origin || '';
  const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction && !isLocalhost,     // false for localhost
    sameSite: ((isProduction && !isLocalhost) ? 'none' : 'lax') as CookieOptions['sameSite'],  // 'lax' for localhost
  };

  res.cookie('DErefreshToken', refreshToken, cookieOptions);

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
