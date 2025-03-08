import { Router } from 'express'
import { paymentController } from './payment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { appointmentZodSchema } from './payment.validation'
import auth from '../../middleware/auth'

const router = Router()

router.get('/', auth('admin'), paymentController.getAllPayment)
router.get('/:id', auth('admin'), paymentController.getPaymentById)

router.post(
  '/',
  zodValidateHandler(appointmentZodSchema.createPaymentZodSchema),
  paymentController.createPayment,
)

router.patch(
  '/:id',
  zodValidateHandler(appointmentZodSchema.updatePaymentZodSchema),
  paymentController.updatePayment,
)

export { router as paymentRouter }
