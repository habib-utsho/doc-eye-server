import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { appointmentService } from './appointment.service'
import { RequestHandler } from 'express'

const getAllAppointment = catchAsync(async (req, res) => {
  const { data, total } = await appointmentService.getAllAppointments(req.query)

  const page = req.query?.page ? Number(req.query.page) : 1
  const limit = req.query?.limit ? Number(req.query.limit) : 10
  const totalPage = Math.ceil(total / limit)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Appointments are retrieved successfully!',
    data,
    meta: { total, page, totalPage, limit },
  })
})

const getAppointmentById: RequestHandler = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(
    req.params?.id,
  )
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Appointment is retrieved successfully!',
    data: appointment,
  })
})

const updateAppointmentById = catchAsync(async (req, res) => {
  const result = await appointmentService.updateAppointmentById(
    req.params?.id,
    req.body,
  )
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Appointment is updated successfully',
    data: result,
  })
})

export const appointmentController = {
  getAllAppointment,
  getAppointmentById,
  updateAppointmentById,
}
