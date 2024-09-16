import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { doctorController } from './doctor.controller'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), doctorController.getAllDoctor)
router.get('/:id', auth(USER_ROLE.ADMIN), doctorController.getDoctorById)
// router.patch(
//   '/:id',
//   auth(USER_ROLE.ADMIN),
//   zodValidateHandler(updateStudentZodSchema),
//   studentController.updateStudentById,
// )

router.delete('/:id', auth(USER_ROLE.ADMIN), doctorController.deleteDoctorById)

export { router as doctorRouter }
