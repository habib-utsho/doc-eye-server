import { StatusCodes } from 'http-status-codes'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { patientServices } from './patient.service' // Change to patientServices
import catchAsync from '../../utils/catchAsync'
import AppError from '../../errors/appError'

const getAllPatients: RequestHandler = catchAsync(async (req, res) => {
  const { data, total } = await patientServices.getAllPatients(req.query) // Change to getAllPatients

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Patients are retrieved successfully!', // Update message
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getPatientById: RequestHandler = catchAsync(async (req, res) => {
  const patient = await patientServices.getPatientById(req.params?.id) // Change to getPatientById
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Patient is retrieved successfully!', // Update message
    data: patient,
  })
})
const updateFavoriteDoctors: RequestHandler = catchAsync(async (req, res) => {
  const patientId = req.user?._id;
  const { doctorId } = req.body;

  const patient = await patientServices.updateFavoriteDoctors(patientId, doctorId)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: patient.message,
    data: patient.patient,
  })
})

const makePatientAdmin: RequestHandler = catchAsync(async (req, res) => {
  const admin = await patientServices.makePatientAdmin(
    req.params?.id,
  )
  if (!admin) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Patient not updated!') // Update message
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Patient promoted to admin successfully', // Update message
    data: admin,
  })
})


// const updatePatientById: RequestHandler = catchAsync(async (req, res) => {
//   const patient = await patientServices.updatePatientById( // Change to patientServices.updatePatientById
//     req.params?.id,
//     req.body,
//   )
//   if (!patient) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Patient not updated!') // Update message
//   }
//   sendResponse(res, StatusCodes.OK, {
//     success: true,
//     message: 'Patient updated successfully!', // Update message
//     data: patient,
//   })
// })

const deletePatientById = catchAsync(async (req, res) => {
  const patient = await patientServices.deletePatientById(req.params.id) // Change to deletePatientById
  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Patient not found!') // Update message
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Patient is deleted successfully!', // Update message
    data: patient,
  })
})

export const patientController = {
  // Change export name to patientController
  getAllPatients, // Change to getAllPatients
  getPatientById, // Change to getPatientById
  makePatientAdmin,
  // updatePatientById, // Change to updatePatientById
  deletePatientById, // Change to deletePatientById
  updateFavoriteDoctors
}
