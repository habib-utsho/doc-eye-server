import Doctor from '../doctor/doctor.model'
import Patient from '../patient/patient.model'
import { TAppointment } from './appointment.interface'
import Appointment from './appointment.model'

const createAppointment = async (payload: TAppointment) => {
  const { doctor, patient } = payload

  const isExistDoctor = await Doctor.findById(doctor)
  const isExistPatient = await Patient.findById(patient)
  if (!isExistDoctor) {
    throw new Error('Doctor not found')
  }
  if (!isExistPatient) {
    throw new Error('Patient not found')
  }

  const result = await Appointment.create(payload)

  return result
}

export const appointmentService = {
  createAppointment,
}
