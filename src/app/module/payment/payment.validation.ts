import { z } from 'zod'

const createPaymentZodSchema = z.object({
  amount: z.number({
    message: 'Amount is required',
  }),
  paymentMethod: z.enum(['bKash', 'SSLCOMMERZ'], {
    message: 'Payment method is either bKash or SSLCOMMERZ',
  }),
})
const updatePaymentZodSchema = z.object({
  appointment: z
    .string({
      message: 'Appointment is required',
    })
    .optional(),
  amount: z
    .number({
      message: 'Amount is required',
    })
    .optional(),
  paymentMethod: z
    .enum(['bKash', 'SSLCOMMERZ'], {
      message: 'Payment method is either bKash or SSLCOMMERZ',
    })
    .optional(),
})

export const paymentZodSchema = {
  createPaymentZodSchema,
  updatePaymentZodSchema,
}
