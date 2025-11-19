import { Schema, model } from 'mongoose'
import { TPayment } from './payment.interface'

const PaymentSchema = new Schema<TPayment>(
  {
    trans_id: {
      type: String,
      required: true,
      unique: true,
    },
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
      consultationFee: {
        type: Number,
        required: true,
      },
      vat: {
        type: Number,
        default: 0,
      },
      platformFee: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['bKash', 'SSLCOMMERZ', 'aamarPay'],
      default: 'aamarPay',
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
