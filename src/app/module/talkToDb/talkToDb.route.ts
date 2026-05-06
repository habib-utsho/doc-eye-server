import { Router } from 'express'
import { talkToDbController } from './talkToDb.controller'
import auth from '../../middleware/auth'
import { USER_ROLE } from '../user/user.constant'

const router = Router()

router.get(
    '/',
    auth(USER_ROLE.ADMIN, USER_ROLE.DOCTOR, USER_ROLE.PATIENT),
    talkToDbController.talkToDb,
)

export { router as talkToDbRouter }
