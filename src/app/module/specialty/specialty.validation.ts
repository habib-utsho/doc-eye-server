import { z } from 'zod'

const createSpecialtyZodSchema = z.object({
  name: z.string({
    required_error: 'Specialty name is required',
  }),
  description: z.string({
    required_error: 'Description is required',
  }),
})
const updateSpecialtyZodSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
})

export const specialtyZodSchema = {
  createSpecialtyZodSchema,
  updateSpecialtyZodSchema,
}
