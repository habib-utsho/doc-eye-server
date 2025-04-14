import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { RequestHandler } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { medicalReportService } from './medicalReport.service'

const createMedicalReport = catchAsync(async (req, res) => {
  const report = await medicalReportService.createMedicalReport(
    req.body,
    req.user as JwtPayload,
  )

  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Medical report created successfully!',
    data: report,
  })
})

const getAllMedicalReports = catchAsync(async (req, res) => {
  const { data, total } = await medicalReportService.getAllMedicalReports(
    req.query,
  )

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Medical reports retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getMedicalReportById: RequestHandler = catchAsync(async (req, res) => {
  const report = await medicalReportService.getMedicalReportById(req.params?.id)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Medical report retrieved successfully!',
    data: report,
  })
})

export const medicalReportController = {
  createMedicalReport,
  getAllMedicalReports,
  getMedicalReportById,
}
