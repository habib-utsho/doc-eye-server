import { Router } from 'express'
import { appointmentController } from './appointment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { appointmentZodSchema } from './appointment.validation'

const router = Router()

router.post(
  '/',
  zodValidateHandler(appointmentZodSchema.createAppointmentZodSchema),
  appointmentController.createAppointment,
)

export { router as appointmentRouter }
