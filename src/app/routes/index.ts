import { Router } from 'express'
import { authRouter } from '../module/auth/auth.route'
import { appointmentRouter } from '../module/appointment/appointment.route'
import { doctorRouter } from '../module/doctor/doctor.route'
import { adminRouter } from '../module/admin/admin.route'
import { patientRouter } from '../module/patient/patient.route'
import { userRouter } from '../module/user/user.route'

const router = Router()
const routes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/appointment',
    route: appointmentRouter,
  },
  {
    path: '/patient',
    route: patientRouter,
  },
  {
    path: '/doctor',
    route: doctorRouter,
  },
  {
    path: '/admin',
    route: adminRouter,
  },
]

routes.forEach((route) => router.use(route.path, route.route))

export default router
