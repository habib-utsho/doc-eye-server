import { NextFunction, Request, Response, Router } from 'express'
import { specialtyController } from './specialty.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { specialtyZodSchema } from './specialty.validation'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data)
    next()
  },
  zodValidateHandler(specialtyZodSchema.createSpecialtyZodSchema),
  specialtyController.createSpecialty,
)

router.get('/', specialtyController.getAllSpecialties)

router.get('/:id', specialtyController.getSpecialtyById)

router.patch(
  '/:id',
  auth(USER_ROLE.ADMIN),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body?.data) {
      req.body = JSON.parse(req.body?.data)
    }
    next()
  },
  zodValidateHandler(specialtyZodSchema.updateSpecialtyZodSchema),
  specialtyController.updateSpecialtyById,
)
router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  specialtyController.deleteSpecialtyById,
)

router.delete('/:id', specialtyController.deleteSpecialtyById)

export { router as specialtyRouter }
