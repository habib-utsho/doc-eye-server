import { Types } from 'mongoose'

export type TAppointment = {
  _id: Types.ObjectId
  doctor: Types.ObjectId
  patient: Types.ObjectId
  appointmentDate: Date
  appointmentType: 'in-person' | 'online'
  symptoms?: string
  status: 'pending' | 'confirmed' | 'completed' | 'canceled'
}
