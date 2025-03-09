import { Router } from 'express'
import { paymentController } from './payment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { paymentZodSchema } from './payment.validation'
import auth from '../../middleware/auth'
import { appointmentZodSchema } from '../appointment/appointment.validation'

const router = Router()

router.get('/', auth('admin'), paymentController.getAllPayment)
router.get('/:id', auth('admin'), paymentController.getPaymentById)

router.post(
  '/',
  zodValidateHandler(appointmentZodSchema.createAppointmentZodSchema),
  paymentController.createPayment,
)

router.patch(
  '/:id',
  zodValidateHandler(paymentZodSchema.updatePaymentZodSchema),
  paymentController.updatePayment,
)

export { router as paymentRouter }
