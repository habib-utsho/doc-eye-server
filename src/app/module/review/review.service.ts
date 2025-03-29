import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import Review from './review.model'
import QueryBuilder from '../../builder/QueryBuilder'
import Appointment from '../appointment/appointment.model'
import { TReview } from './review.interface'
import { JwtPayload } from 'jsonwebtoken'
import Patient from '../patient/patient.model'



const createReview = async (payload: TReview, user:JwtPayload) => {


  // Check if the patient exist
  const patient = await Patient.findById(user._id)
  if(!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Patient not found')
  }

  
  
  // Check if the appointment exists and is completed
  const appointmentExists = await Appointment.findById(payload.appointment)
  if (!appointmentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Appointment not found')
  }
  if(appointmentExists.patient != user._id) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized to create this review')
  }
  if (appointmentExists.status !== 'completed') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Review can only be created for completed appointments',
    )
  }

  
  // Create the review
  const review = await Review.create({...payload, patient: user._id, doctor: appointmentExists.doctor})
  return review
}

const getAllReview = async (query: Record<string, unknown>) => {

  const reviewQuery = new QueryBuilder(Review.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'doctor', select: '_id doctorTitle name profileImg email' },
      { path: 'patient', select: '_id doctorTitle name profileImg email' },
      { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await reviewQuery?.queryModel
  const total = await Review.countDocuments(
    reviewQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getReviewById = async (id: string) => {
  const review = await Review.findById(id)
    .select('-__v')
    .populate('doctor', '_id doctorTitle name profileImg email')
    .populate('patient', '_id name profileImg email')
    .populate('appointment', '-createdAt -updatedAt -__v')

  if (!review) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Review not found')
  }
  return review
}

export const reviewService = {
  createReview,
  getAllReview,
  getReviewById,
}
