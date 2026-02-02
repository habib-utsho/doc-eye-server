import { Schema, model } from 'mongoose'
import { TReview } from './review.interface'

const ReviewSchema = new Schema<TReview>(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create the Review model
const Review = model('Review', ReviewSchema)

export default Review
