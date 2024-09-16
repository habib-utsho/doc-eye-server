import { z } from 'zod'

const signinZodSchema = z.object({
  email: z.string(),
  password: z.string(),
})
const forgetPasswordZodSchema = z.object({
  email: z.string(),
})
const changePasswordZodSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})
const resetPasswordZodSchema = z.object({
  email: z.string(),
  newPassword: z.string(),
})

export const authZodSchema = {
  signinZodSchema,
  forgetPasswordZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema,
}
