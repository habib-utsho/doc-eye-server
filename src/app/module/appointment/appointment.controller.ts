import { StatusCodes } from 'http-status-codes'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { appointmentService } from './appointment.service'

const createAppointment = catchAsync(async (req, res) => {
  const result = await appointmentService.createAppointment(req.body)

  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Appointment is created successfully',
    data: result,
  })
})

export const appointmentController = {
  createAppointment,
}
