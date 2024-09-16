import { NextFunction, Request, Response, Router } from 'express'

import zodValidateHandler from '../../middleware/zodValidateHandler'

import { userController } from './user.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from './user.constant'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

router.post(
  '/create-patient',
  auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createStudentZodSchema),
  userController.insertStudent,
)
router.post(
  '/create-faculty',
  zodValidateHandler(createFacultyZodSchema),
  userController.insertFaculty,
)
router.post(
  '/create-admin',
  zodValidateHandler(createAdminZodSchema),
  userController.insertAdmin,
)

router.get(
  '/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.FACULTY, USER_ROLE.STUDENT),
  userController.getMe,
)
// Not secured for blood donor (TODO: Only admin and faculty should be access)
router.get('/', userController.getAllUsers)
router.get('/:id', userController.getUserById)

export { router as userRouter }
