import { Router } from 'express'
import { paymentControllers } from './payment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { paymentZodSchema } from './payment.validate'

const router = Router()

router.post(
  '/init',
  zodValidateHandler(paymentZodSchema.initPaymentZodSchema),
  paymentControllers.initPayment,
)

router.post(
  '/failed',
  paymentControllers.failedPayment,
)

export { router as paymentRouter2 }
