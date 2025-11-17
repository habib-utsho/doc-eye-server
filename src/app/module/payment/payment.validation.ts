import { z } from 'zod'

const createPaymentZodSchema = z.object({
  trans_id: z.string(),
  amount: z.object({
    consultationFee: z.number(),
    vat: z.number().optional(),
    platformFee: z.number().optional(),
    total: z.number(),
  }),
  paymentMethod: z.enum(['bKash', 'SSLCOMMERZ'], {
    message: 'Payment method is either bKash or SSLCOMMERZ',
  }).optional(),
})

export const paymentZodSchema = {
  createPaymentZodSchema,
}
