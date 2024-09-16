import { z } from 'zod'

const signinZodSchema = z.object({
  id: z.string(),
  password: z.string(),
})
const forgetPasswordZodSchema = z.object({
  id: z.string(),
})
const changePasswordZodSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
})
const resetPasswordZodSchema = z.object({
  id: z.string(),
  newPassword: z.string(),
})

export const authZodSchema = {
  signinZodSchema,
  forgetPasswordZodSchema,
  changePasswordZodSchema,
  resetPasswordZodSchema
}
