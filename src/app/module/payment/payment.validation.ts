import { z } from 'zod'

const createPaymentZodSchema = z.object({
  amount: z.number({
    message: 'Amount is required',
  }),
  paymentMethod: z.enum(['bKash', 'SSLCOMMERZ'], {
    message: 'Payment method is either bKash or SSLCOMMERZ',
  }),
})


export const paymentZodSchema = {
  createPaymentZodSchema,
}
