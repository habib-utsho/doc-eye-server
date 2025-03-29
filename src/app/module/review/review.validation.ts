import { z } from 'zod'

const createReviewZodSchema = z.object({
  appointment: z.string({
    required_error: 'Appointment is required',
  }),
  rating: z.number({
    required_error: 'Rating is required',
  }).min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
  comment: z.string({
    required_error: 'Comment is required',
  }),
})

export const reviewZodSchema = {
  createReviewZodSchema,
}
