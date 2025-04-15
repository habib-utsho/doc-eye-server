import { Types } from 'mongoose'

export type TPayment = {
  _id: Types.ObjectId
  appointment: Types.ObjectId
  patient: Types.ObjectId
  doctor: Types.ObjectId
  amount: {
    consultationFee: number
    vat: number
    platformFee: number
    total: number
  }
  paymentMethod: 'bKash' | 'SSLCOMMERZ'
  status: 'pending' | 'confirmed' | 'canceled'
}
