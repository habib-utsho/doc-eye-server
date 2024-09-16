import { Router } from 'express'
import { authRouter } from '../module/auth/auth.route'
import { appointmentRouter } from '../module/appointment/appointment.route'

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
]

routes.forEach((route) => router.use(route.path, route.route))

export default router
