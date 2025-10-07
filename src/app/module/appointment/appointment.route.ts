import { Router } from 'express'
import { appointmentController } from './appointment.controller'
import zodValidateHandler from '../../middleware/zodValidateHandler'
import { appointmentZodSchema } from './appointment.validation'
import { USER_ROLE } from '../user/user.constant'
import auth from '../../middleware/auth'

const router = Router()

router.get('/', auth(USER_ROLE.DOCTOR, USER_ROLE.ADMIN, USER_ROLE.PATIENT), appointmentController.getAllAppointment)
router.get('/:id', auth(USER_ROLE.DOCTOR, USER_ROLE.ADMIN, USER_ROLE.PATIENT), appointmentController.getAppointmentById)
router.patch(
  '/update-status/:id', auth(USER_ROLE.DOCTOR, USER_ROLE.ADMIN),
  zodValidateHandler(appointmentZodSchema.updateAppointmentStatusZodSchema),
  appointmentController.updateAppointmentStatusById,
)

export { router as appointmentRouter }
