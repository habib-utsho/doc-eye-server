import { z } from 'zod'
import { Types } from 'mongoose'

const objectId = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
})

const createMedicalReportZodSchema = z.object({
  appointment: objectId,
  doctor: objectId,
  patient: objectId,
  problems: z
    .array(z.string().min(1, 'Problem cannot be empty'))
    .nonempty('At least one problem is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  medications: z
    .array(
      z.object({
        name: z.string().min(1, 'Medication name is required'),
        dosage: z.string().min(1, 'Dosage is required'),
        frequency: z.string().min(1, 'Frequency is required'),
        duration: z.string().min(1, 'Duration is required'),
      }),
    )
    .optional(),
  advices: z.array(z.string().min(1)).optional(),
  tests: z.array(z.string().min(1)).optional(),
  followUpDate: z.coerce.date().optional(),
})

export const medicalReportZodSchema = {
  createMedicalReportZodSchema,
}
