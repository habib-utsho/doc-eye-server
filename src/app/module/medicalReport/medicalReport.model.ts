import { Schema, model } from 'mongoose'
import { TMedicalReport } from './medicalReport.interface'

const MedicalReportSchema = new Schema<TMedicalReport>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    problems: {
      type: [String],
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    medications: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
      },
    ],
    advices: {
      type: [String],
    },
    followUpDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

const MedicalReport = model('MedicalReport', MedicalReportSchema)

export default MedicalReport
