import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import Review from './review.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { TReview } from './review.interface'
import { JwtPayload } from 'jsonwebtoken'
import Patient from '../patient/patient.model'
import Appointment from '../appointment/appointment.model'



const createReview = async (payload: TReview, user: JwtPayload) => {


  // Check if the patient exist
  const patient = await Patient.findById(user._id)
  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Patient not found')
  }

  if (String(user._id) !== String(payload.patient)) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized to create review for another patient')
  }



  // Check at least one completed appointment exists for this patient with the doctor
  const appointmentExists = await Appointment.findOne({
    doctor: payload.doctor,
    patient: user._id,
    status: 'completed',
  })
  if (!appointmentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No completed appointment found with this doctor for the patient')
  }

  const existingReview = await Review.findOne({
    doctor: payload.doctor,
    patient: user._id,
  })
  if (existingReview) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'You have already reviewed this doctor')
  }


  // Create the review
  const review = await Review.create({ ...payload, patient: user._id, doctor: appointmentExists.doctor })
  return review
}

const getAllReview = async (query: Record<string, unknown>) => {

  const reviewQuery = new QueryBuilder(Review.find(), {
    ...query,
    sort: `${query.sort} -createdAt`,
  })
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'doctor', select: '_id doctorTitle name profileImg email' },
      { path: 'patient', select: '_id doctorTitle name profileImg email' },
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
