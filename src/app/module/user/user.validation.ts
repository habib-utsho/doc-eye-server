import { z } from 'zod'

// Custom password validation regex for security criteria
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
const createUserZodSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      passwordRegex,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    ),
  needsPasswordChange: z.boolean().optional(),
  role: z.enum(['admin', 'doctor', 'patient']),
  status: z.enum(['active', 'inactive']),
  isDeleted: z.boolean().optional(),
})
export { createUserZodSchema }
