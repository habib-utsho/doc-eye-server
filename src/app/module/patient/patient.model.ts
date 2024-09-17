import { Schema, model } from 'mongoose'
import { bloodGroups, districts } from './patient.constant'
import { TPatient } from './patient.interface'

// Patient Schema
const patientSchema = new Schema<TPatient>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    profileImg: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female'],
    },
    district: {
      type: String,
      required: true,
      enum: districts,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: bloodGroups,
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    allergies: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Patient Model
const Patient = model('Patient', patientSchema)

export default Patient
