import { NextFunction, Request, Response, Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { adminController } from './admin.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { updateAdminZodSchema } from './admin.validation'
import { upload } from '../../utils/uploadImgToCloudinary'

const router = Router()

router.get('/', auth(USER_ROLE.ADMIN), adminController.getAllAdmins)
router.get('/:id', auth(USER_ROLE.ADMIN), adminController.getAdminById)
router.patch(
    '/:id',
    auth(USER_ROLE.ADMIN),
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body?.data)
        next()
    },
    zodValidateHandler(updateAdminZodSchema),
    adminController.updateAdminById,
)

router.delete('/:id', auth(USER_ROLE.ADMIN), adminController.deleteAdminById)

export { router as adminRouter }
