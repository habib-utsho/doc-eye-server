import { Schema, model } from 'mongoose'
import { TPayment } from './payment.interface'

const PaymentSchema = new Schema<TPayment>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      default: null,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      default: null,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'SSLCOMMERZ'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
)

const Payment = model('Payment', PaymentSchema)

export default Payment
