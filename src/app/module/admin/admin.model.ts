import mongoose, { Schema } from 'mongoose'
import { TAdmin } from './admin.interface'

const AdminSchema = new Schema<TAdmin>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
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
  nid: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

const Admin = mongoose.model('Admin', AdminSchema)

export default Admin
