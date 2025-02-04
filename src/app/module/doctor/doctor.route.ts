import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { doctorController } from './doctor.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { updateDoctorZodSchema } from './doctor.validation'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), doctorController.getAllDoctor)
router.get('/:id', auth(USER_ROLE.ADMIN), doctorController.getDoctorById)
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.DOCTOR),
  zodValidateHandler(updateDoctorZodSchema),
  doctorController.updateDoctorById,
)

router.delete('/:id', auth(USER_ROLE.ADMIN), doctorController.deleteDoctorById)

export { router as doctorRouter }
