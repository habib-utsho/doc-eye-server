import { NextFunction, Request, Response, Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { patientController } from './patient.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { favoriteDoctorParamsZodSchema, updatePatientZodSchema } from './patient.validation'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), patientController.getAllPatients)
router.get('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.PATIENT), patientController.getPatientById)
router.patch(
  '/:id',
  auth(USER_ROLE.PATIENT, USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(updatePatientZodSchema),
  patientController.updatePatientById,
)

router.patch('/make-patient-admin/:id', auth(USER_ROLE.ADMIN), patientController.makePatientAdmin)


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
