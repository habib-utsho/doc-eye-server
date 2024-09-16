import { Router } from 'express'
import { authRouter } from '../module/auth/auth.route'
import { appointmentRouter } from '../module/appointment/appointment.route'
import { doctorRouter } from '../module/doctor/doctor.route'

const router = Router()
const routes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/appointment',
    route: appointmentRouter,
  },
  {
    path: '/doctor',
    route: doctorRouter,
  },
]

routes.forEach((route) => router.use(route.path, route.route))

export default router
