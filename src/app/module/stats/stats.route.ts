import { Router } from 'express'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'
import { statsController } from './stats.controller'

const router = Router()

router.get('/patient', auth(USER_ROLE.PATIENT), statsController.getPatientStats)
router.get('/doctor', auth(USER_ROLE.DOCTOR), statsController.getDoctorStats)
router.get('/admin', auth(USER_ROLE.ADMIN), statsController.getAdminStats)
router.get('/earnings', auth(USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.PATIENT), statsController.getEarningsStats)

export { router as statsRouter }
