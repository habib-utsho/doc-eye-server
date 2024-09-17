import { NextFunction, Request, Response, Router } from 'express'

import zodValidateHandler from '../../middleware/zodValidateHandler'

import { userController } from './user.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from './user.constant'
import { upload } from '../../utils/uploadImgToCloudinary'
import { createPatientZodSchema } from '../patient/patient.validation'
import { createDoctorZodSchema } from '../doctor/doctor.validation'
import { createAdminZodSchema } from '../admin/admin.validation'

const router = Router()

router.post(
  '/create-patient',
  auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createPatientZodSchema),
  userController.insertPatient,
)

router.post(
  '/create-doctor',
  auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createDoctorZodSchema),
  userController.insertDoctor,
)

router.post(
  '/create-admin',
  auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(createAdminZodSchema),
  userController.insertAdmin,
)
// router.post(
//   '/create-admin',
//   zodValidateHandler(createAdminZodSchema),
//   userController.insertAdmin,
// )

router.get(
  '/me',
  auth(USER_ROLE.ADMIN, USER_ROLE.PATIENT, USER_ROLE.DOCTOR),
  userController.getMe,
)

router.get('/', auth(USER_ROLE.ADMIN), userController.getAllUsers)
router.get('/:id', auth(USER_ROLE.ADMIN), userController.getUserById)

export { router as userRouter }
