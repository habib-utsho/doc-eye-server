import { Router } from 'express'
import { medicalReportController } from './medicalReport.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { medicalReportZodSchema } from './medicalReport.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.post(
  '/',
  auth(USER_ROLE.DOCTOR),
  zodValidateHandler(medicalReportZodSchema.createMedicalReportZodSchema),
  medicalReportController.createMedicalReport,
)

router.get('/', medicalReportController.getAllMedicalReports)

router.get('/:id', medicalReportController.getMedicalReportById)

export { router as medicalReportRouter }
