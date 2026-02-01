import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { doctorServices } from './doctor.service'
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'

const getAllDoctor: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await doctorServices.getAllDoctor(req.query)

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctors are retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getDoctorById: RequestHandler = catchAsync(async (req, res) => {
  const doctor = await doctorServices.getDoctorById(req.params?.id as string);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctor is retrieved successfully!',
    data: doctor,
  })
})
const getDoctorByDoctorCode: RequestHandler = catchAsync(async (req, res) => {
  const doctor = await doctorServices.getDoctorByDoctorCode(req.params?.id as string);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctor is retrieved successfully!',
    data: doctor,
  })
})

const updateDoctorById: RequestHandler = catchAsync(async (req, res) => {
  const { doctor, accessToken, refreshToken } = await doctorServices.updateDoctorById(
    req.params?.id as string,
    req.file,
    req.body,
  )
  if (!doctor) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Doctor is not updated!')
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
    message: `${doctor.name}, your profile is updated successfully!`,
    data: doctor,
    accessToken,
    refreshToken,
  })
})

const deleteDoctorById = catchAsync(async (req, res) => {
  const doctor = await doctorServices.deleteDoctorById(req.params?.id as string);
  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Doctor not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctor is deleted successfully!',
    data: doctor,
  })
})

export const doctorController = {
  getAllDoctor,
  getDoctorById,
  getDoctorByDoctorCode,
  updateDoctorById,
  deleteDoctorById,
}
