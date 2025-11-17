import { z } from 'zod'
import { appointmentZodSchema } from '../appointment/appointment.validation'

const initPaymentZodSchema = z.object({
   amount: z.object({
    consultationFee: z.number(),
    vat: z.number().optional(),
    platformFee: z.number().optional(),
    total: z.number(),
  }),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  ...appointmentZodSchema.createAppointmentZodSchema.shape,
})
export const paymentZodSchema = {
  initPaymentZodSchema,
}
