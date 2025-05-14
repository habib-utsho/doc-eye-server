import { Router } from 'express'
import { authRouter } from '../module/auth/auth.route'
import { appointmentRouter } from '../module/appointment/appointment.route'
import { doctorRouter } from '../module/doctor/doctor.route'
import { adminRouter } from '../module/admin/admin.route'
import { patientRouter } from '../module/patient/patient.route'
import { userRouter } from '../module/user/user.route'
import { specialtyRouter } from '../module/specialty/specialty.route'
import { paymentRouter } from '../module/payment/payment.route'
import { reviewRouter } from '../module/review/review.route'
import { medicalReportRouter } from '../module/medicalReport/medicalReport.route'

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
    path: '/specialty',
    route: specialtyRouter,
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
  {
    path: '/appointment',
    route: appointmentRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/review',
    route: reviewRouter,
  },
  {
    path: '/medical-report',
    route: medicalReportRouter,
  },
]

routes.forEach((route) => router.use(route.path, route.route))

export default router
