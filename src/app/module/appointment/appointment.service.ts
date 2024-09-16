import { TAppointment } from './appointment.interface'
import Appointment from './appointment.model'

const createAppointment = async (appointment: TAppointment) => {
  const newAppointment = new Appointment(appointment)
  return newAppointment.save()
}


export const appointmentService = {
    createAppointment,
}