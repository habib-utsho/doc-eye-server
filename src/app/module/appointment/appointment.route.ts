import { Router } from 'express'
import { appointmentController } from './appointment.controller'

const router = Router()

router.get('/appointment', appointmentController.createAppointment)

export { router as appointmentRouter }
