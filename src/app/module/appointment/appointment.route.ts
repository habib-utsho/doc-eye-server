import { Router } from 'express'
import { appointmentController } from './appointment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { appointmentZodSchema } from './appointment.validation'

const router = Router()

router.get('/', auth('admin'), paymentController.getAllPayment)
router.get('/:id', auth('admin'), paymentController.getPaymentById)
router.post(
  '/',
  zodValidateHandler(appointmentZodSchema.createAppointmentZodSchema),
  appointmentController.createAppointment,
)

export { router as appointmentRouter }
