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
  const doctor = await doctorServices.getDoctorById(req.params?.id)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctor is retrieved successfully!',
    data: doctor,
  })
})

const updateDoctorById: RequestHandler = catchAsync(async (req, res) => {
  const doctor = await doctorServices.updateDoctorById(req.params?.id, req.file, req.body)
  if (!doctor) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Doctor not updated!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Doctor updated successfully!',
    data: doctor,
  })
})

const deleteDoctorById = catchAsync(async (req, res) => {
  const doctor = await doctorServices.deleteDoctorById(req.params.id)
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
  updateDoctorById,
  deleteDoctorById,
}
