import { z } from 'zod'

const createReviewZodSchema = z.object({
  rating: z.number({
    required_error: 'Rating is required',
  }).min(0, 'Rating must be at least 0').max(5, 'Rating must be at most 5'),
  comment: z.string({
    required_error: 'Comment is required',
  }),
  patient: z.string({
    required_error: 'Patient ID is required',
  }),
  doctor: z.string({
    required_error: 'Doctor ID is required',
  }),
})

export const reviewZodSchema = {
  createReviewZodSchema,
}
