import { Types } from 'mongoose'

export type TReview = {
  _id: Types.ObjectId
  doctor: Types.ObjectId
  patient: Types.ObjectId
  rating: number
  comment: string
}
