import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { patientController } from './patient.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { favoriteDoctorParamsZodSchema } from './patient.validation'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), patientController.getAllPatients)
router.get('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.PATIENT), patientController.getPatientById)
// router.patch(
//   '/:id',
//   auth(USER_ROLE.ADMIN),
//   zodValidateHandler(updateStudentZodSchema),
//   studentController.updateStudentById,
// )


router.patch('/favorite-doctors',
  auth(USER_ROLE.PATIENT),
  zodValidateHandler(favoriteDoctorParamsZodSchema),
  patientController.updateFavoriteDoctors,
)

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  patientController.deletePatientById,
)

export { router as patientRouter }
