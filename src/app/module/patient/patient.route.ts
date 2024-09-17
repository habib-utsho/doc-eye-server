import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { patientController } from './patient.controller'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), patientController.getAllPatients)
router.get('/:id', auth(USER_ROLE.ADMIN), patientController.getPatientById)
// router.patch(
//   '/:id',
//   auth(USER_ROLE.ADMIN),
//   zodValidateHandler(updateStudentZodSchema),
//   studentController.updateStudentById,
// )

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  patientController.deletePatientById,
)

export { router as patientRouter }
