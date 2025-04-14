import { Schema, model } from 'mongoose'
import { TMedicalReport } from './medicalReport.interface'

const MedicalReportSchema = new Schema<TMedicalReport>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'SSLCOMMERZ'],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const MedicalReport = model('MedicalReport', MedicalReportSchema)

export default MedicalReport
