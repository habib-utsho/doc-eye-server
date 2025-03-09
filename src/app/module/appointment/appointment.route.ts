import { Router } from 'express'
import { appointmentController } from './appointment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { appointmentZodSchema } from './appointment.validation'

const router = Router()

router.get('/', appointmentController.getAllAppointment)
router.get('/:id', appointmentController.getAppointmentById)
router.patch(
  '/:id',
  zodValidateHandler(appointmentZodSchema.updateAppointmentZodSchema),
  appointmentController.updateAppointmentById,
)

export { router as appointmentRouter }
