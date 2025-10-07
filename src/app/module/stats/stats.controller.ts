import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { statsService } from './stats.service'
import AppError from '../../errors/appError'



const getPatientStats = catchAsync(async (req, res) => {

  const pPatient = req?.user;

  if (!pPatient) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to access this route',
    )
  }

  const data = await statsService.getPatientStats(pPatient);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Patient stats retrieved successfully',
    data,
  })
})

const getDoctorStats = catchAsync(async (req, res) => {

  const pDoctor = req?.user;

  if (!pDoctor) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to access this route',
    )
  }

  const data = await statsService.getDoctorStats(pDoctor);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctor stats retrieved successfully',
    data,
  })
})

const getAdminStats = catchAsync(async (req, res) => {

  const pAdmin = req?.user;
  if (!pAdmin) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to access this route',
    )
  }
  const data = await statsService.getAdminStats(pAdmin);

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Admin stats retrieved successfully',
    data,
  })
})


export const statsController = {
  getPatientStats, getDoctorStats, getAdminStats
}