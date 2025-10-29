import mongoose, { Schema } from 'mongoose'
import { TAdmin } from './admin.interface'
import { bloodGroups } from '../patient/patient.constant'

const AdminSchema = new Schema<TAdmin>(
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
    bloodGroup: {
      type: String,
      required: true,
      enum: bloodGroups,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    profileImg: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    district: {
      type: String,
      required: true, // Assuming TDistrict is a string
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Admin = mongoose.model('Admin', AdminSchema)

export default Admin
