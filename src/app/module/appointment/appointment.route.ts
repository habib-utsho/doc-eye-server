import { Router } from 'express'
import { appointmentController } from './appointment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { appointmentZodSchema } from './appointment.validation'

const router = Router()

router.get('/', appointmentController.getAllAppointment)
router.get('/:id', appointmentController.getAppointmentById)
router.patch(
  '/update-status/:id',
  zodValidateHandler(appointmentZodSchema.updateAppointmentStatusZodSchema),
  appointmentController.updateAppointmentStatusById,
)

export { router as appointmentRouter }
