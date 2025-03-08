import { Types } from 'mongoose'

export type TPayment = {
  _id: Types.ObjectId
  appointment: Types.ObjectId
  amount: string
  paymentMethod: 'bKash' | 'SSLCOMMERZ'
}
