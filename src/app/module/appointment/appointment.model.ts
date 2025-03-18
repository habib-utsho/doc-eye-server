import { Schema, model } from 'mongoose'
import { TAppointment } from './appointment.interface'

const AppointmentSchema = new Schema<TAppointment>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
    schedule: {
      type: Date,
      required: true,
    },
    appointmentType: {
      type: String,
      enum: ['in-person', 'online'],
      default: 'online',
    },
    symptoms: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'canceled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

// Create the Appointment model
const Appointment = model('Appointment', AppointmentSchema)

export default Appointment
