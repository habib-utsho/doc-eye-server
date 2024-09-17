import { z } from 'zod'

const createAppointmentZodSchema = z.object({
  doctor: z.string({
    required_error: 'Doctor is required',
  }),
  patient: z.string({
    required_error: 'Patient is required',
  }),
  appointmentDateTime: z.string({
    required_error: 'Appointment date is required',
  }),
  appointmentType: z
    .enum(['in-person', 'online'], {
      message: 'Appointment type is either in-person or online',
    })
    .default('online'),
  symptoms: z.string().optional(),
})

export const appointmentZodSchema = {
  createAppointmentZodSchema,
}
