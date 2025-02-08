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
      default:
        'https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png',
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other '],
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
      default: null,
    },
    height: {
      type: Number,
      default: null,
    },
    allergies: {
      type: String,
      default: null,
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
