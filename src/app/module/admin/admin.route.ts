import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { adminController } from './admin.controller'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), adminController.getAllAdmins)
router.get('/:id', auth(USER_ROLE.ADMIN), adminController.getAdminById)
// router.patch(
//   '/:id',
//   auth(USER_ROLE.ADMIN),
//   zodValidateHandler(updateStudentZodSchema),
//   studentController.updateStudentById,
// )

router.delete('/:id', auth(USER_ROLE.ADMIN), adminController.deleteAdminById)

export { router as adminRouter }
