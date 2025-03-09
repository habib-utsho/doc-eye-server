import { Types } from 'mongoose'

export type TPayment = {
  _id: Types.ObjectId
  appointment: Types.ObjectId
  amount: number
  paymentMethod: 'bKash' | 'SSLCOMMERZ'
  status: 'pending' | 'confirmed' | 'canceled'
}
