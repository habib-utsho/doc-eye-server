import { Router } from 'express'
import { paymentController } from './payment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import auth from '../../middleware/auth'
import { appointmentZodSchema } from '../appointment/appointment.validation'

const router = Router()

router.get(
  '/',
  auth('admin', 'doctor', 'patient'),
  paymentController.getAllPayment,
)
router.get('/:id', auth('admin'), paymentController.getPaymentById)

router.post(
  '/',
  zodValidateHandler(appointmentZodSchema.createAppointmentZodSchema),
  paymentController.initPayment,
)


export { router as paymentRouter }
