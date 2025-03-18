import { z } from 'zod'

const createAppointmentZodSchema = z.object({
  doctor: z.string({
    required_error: 'Doctor is required',
  }),
  patient: z.string({
    required_error: 'Patient is required',
  }),
  schedule: z.string({
    required_error: 'Schedule is required',
  }),
  status: z
    .enum(['pending', 'confirmed', 'completed', 'canceled'], {
      message: 'Status is either pending, confirmed, completed, or canceled',
    })
    .default('pending'),
  appointmentType: z
    .enum(['in-person', 'online'], {
      message: 'Appointment type is either in-person or online',
    })
    .default('online'),
  symptoms: z.string().optional(),
})
const updateAppointmentStatusZodSchema = z.object({
  status: z.enum(['completed', 'confirmed', 'canceled'], {
    required_error: 'Status is either confirmed or canceled',
  }),
})

export const appointmentZodSchema = {
  createAppointmentZodSchema,
  updateAppointmentStatusZodSchema,
}
