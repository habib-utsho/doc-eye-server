import { NextFunction, Request, Response, Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { doctorController } from './doctor.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { updateDoctorZodSchema } from './doctor.validation'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

router.get('/', doctorController.getAllDoctor)
router.get('/:id', doctorController.getDoctorById)
router.get('/doctor-code/:id', doctorController.getDoctorByDoctorCode)
router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.DOCTOR),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(updateDoctorZodSchema),
  doctorController.updateDoctorById,
)

router.delete('/:id', auth(USER_ROLE.ADMIN), doctorController.deleteDoctorById)

export { router as doctorRouter }
