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
    appointmentDateTime: {
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
