import mongoose, { Schema } from 'mongoose'
import { TDoctor } from './doctor.interface' // Adjust the path as needed

const DoctorSchema: Schema = new Schema<TDoctor>({
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
    unique: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true,
  },
  profileImg: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    required: true,
  },
  doctorTitle: {
    type: String,
    enum: ['Dr.', 'Prof. Dr.', 'Assoc. Prof. Dr.', 'Asst. Prof. Dr.'],
    required: true,
  },
  doctorType: {
    type: String,
    enum: ['Medical', 'Dental', 'Veterinary'],
    required: true,
  },
  medicalSpecialty: {
    type: [String],
    required: true,
  },
  totalExperienceYear: {
    type: Number,
    required: true,
  },
  medicalDegree: {
    type: String,
    required: true,
  },
  consultationFee: {
    type: Number,
    required: true,
  },
  followupFee: {
    type: Number,
    required: true,
  },
  workingExperiences: [
    {
      workPlace: {
        type: String,
        required: true,
      },
      department: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
        required: true,
      },
      workingPeriod: {
        type: String,
        required: true,
      },
    },
  ],
  dateOfBirth: {
    type: Date,
    required: true,
  },
  currentWorkplace: {
    type: String,
    required: true,
  },
  availability: {
    dayStart: {
      type: String,
      required: true,
    },
    dayEnd: {
      type: String,
      required: true,
    },
    timeStart: {
      type: String,
      required: true,
    },
    timeEnd: {
      type: String,
      required: true,
    },
  },
  district: {
    type: String,
    required: true, // Assuming TDistrict is a string
  },
  nid: {
    type: Number,
    required: true,
  },
  bmdc: {
    type: Number,
    required: true,
  },
  patientAttended: {
    type: Number,
    default: 0,
  },
  doctorCode: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approve', 'reject'],
    default: 'pending',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
})

DoctorSchema.pre('save', function (next) {
  // Add any pre-save logic here
  next()
})

// Create the Doctor model
const Doctor = mongoose.model('Doctor', DoctorSchema)

export default Doctor
