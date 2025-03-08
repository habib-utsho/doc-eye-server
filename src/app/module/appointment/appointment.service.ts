import Doctor from '../doctor/doctor.model'
import Patient from '../patient/patient.model'
import Payment from '../payment/payment.model'
import { TAppointment } from './appointment.interface'
import Appointment from './appointment.model'

const createAppointment = async (payload: TAppointment) => {
  const { doctor, patient, payment } = payload || {}

  const isExistDoctor = await Doctor.findById(doctor)
  const isExistPatient = await Patient.findById(patient)
  const isExistPayment = await Payment.findById(payment)
  if (!isExistDoctor) {
    throw new Error('Doctor not found')
  }
  if (!isExistPatient) {
    throw new Error('Patient not found')
  }
  if (!isExistPayment) {
    throw new Error('Payment not found')
  }

  const result = await Appointment.create(payload)

  return result
}

export const appointmentService = {
  createAppointment,
}
