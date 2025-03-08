import { Schema, model } from 'mongoose'
import { TPayment } from './payment.interface'

const PaymentSchema = new Schema<TPayment>(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      default: null,
    },
    amount: {
      type: String,
      required: true,
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

const Payment = model('Payment', PaymentSchema)

export default Payment
