import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { specialtyService } from './specialty.service'
import AppError from '../../errors/appError'

const createSpecialty = catchAsync(async (req, res) => {
  const result = await specialtyService.createSpecialty(req.file, req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Specialty is created successfully',
    data: result,
  })
})

const getAllSpecialties = catchAsync(async (req, res) => {
  const { data, total } = await specialtyService.getAllSpecialty(req.query)

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Specialties are retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getSpecialtyById = catchAsync(async (req, res) => {
  const specialty = await specialtyService.getSpecialtyById(req.params?.id as string)
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Specialty is retrieved successfully!',
    data: specialty,
  })
})

const updateSpecialtyById = catchAsync(async (req, res) => {
  const specialty = await specialtyService.updateSpecialtyById(
    req.file,
    req.params?.id as string,
    req.body,
  )
  if (!specialty) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Specialty not updated!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Specialty updated successfully!',
    data: specialty,
  })
})

const deleteSpecialtyById = catchAsync(async (req, res) => {
  const specialty = await specialtyService.deleteSpecialtyById(req.params?.id as string)
  if (!specialty) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Specialty not found!')
  }
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Specialty is deleted successfully!',
    data: specialty,
  })
})

export const specialtyController = {
  createSpecialty,
  getAllSpecialties,
  getSpecialtyById,
  updateSpecialtyById,
  deleteSpecialtyById,
}
