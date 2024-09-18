import { Schema, model } from 'mongoose'
import { TSpecialty } from './specialty.interface'

const specialtySchema = new Schema<TSpecialty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create the Appointment model
const Specialty = model('Specialty', specialtySchema)

export default Specialty
