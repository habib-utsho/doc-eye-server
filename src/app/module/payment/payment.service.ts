import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import Payment from './payment.model'
import QueryBuilder from '../../builder/QueryBuilder'
import mongoose from 'mongoose'
import Appointment from '../appointment/appointment.model'
import { TAppointment } from '../appointment/appointment.interface'
import Doctor from '../doctor/doctor.model'
import Patient from '../patient/patient.model'
import moment from 'moment-timezone'
import { JwtPayload } from 'jsonwebtoken'

const initPayment = async (payload: Partial<TAppointment>) => {
  const session = await mongoose.startSession()
  session.startTransaction()
  try {
    const { doctor, patient } = payload || {}
    const isExistDoctor = await Doctor.findById(doctor)
    const isExistPatient = await Patient.findById(patient)
    if (!payload.schedule) {
      throw new Error('Schedule is required')
    }
    const isExistSchedule = await Appointment.findOne({
      doctor: doctor,
      patient: patient,
      schedule: new Date(payload.schedule),
    })
    if (!isExistDoctor) {
      throw new Error('Doctor not found')
    }
    if (!isExistPatient) {
      throw new Error('Patient not found')
    }
    if (isExistSchedule) {
      throw new Error('Schedule already exist')
    }

    const payment = await Payment.create(
      [{ ...payload, status: 'confirmed' }],
      { session },
    )
    const gmt6Schedule = moment(payload.schedule).tz('Asia/Dhaka').toDate()
    const appointmentPayload = {
      ...payload,
      schedule: gmt6Schedule,
      status: 'pending',
      payment: payment[0]._id,
    }
    const appointment = await Appointment.create([appointmentPayload], {
      session,
    })

    const updatedPayment = await Payment.findByIdAndUpdate(
      payment[0]._id,
      { appointment: appointment[0]._id },
      { new: true, session },
    )

    await session.commitTransaction()
    session.endSession()
    // if (!payment) {
    //   throw new AppError(StatusCodes.NOT_FOUND, 'Payment not created')
    // }
    return { payment: updatedPayment, appointment: appointment[0] }
  } catch (err: any) {
    throw new AppError(StatusCodes.BAD_REQUEST, err.message)
  }
}

const getAllPayment = async (
  query: Record<string, unknown>,
  currentUser: JwtPayload,
) => {
  console.log(currentUser, 'currentUser')
  let filteredQuery = {}
  if (currentUser.role === 'doctor') {
    filteredQuery = { doctor: currentUser._id }
  } else if (currentUser.role === 'patient') {
    filteredQuery = { patient: currentUser._id }
  }

  console.log(filteredQuery, 'filteredQuery')
  const paymentQuery = new QueryBuilder(Payment.find(filteredQuery), {
    ...query,
    sort: `${query.sort}`,
  })
    .populateQuery([
      {
        path: 'appointment',
        select: '-createdAt -updatedAt -__v',
      },
      { path: 'doctor', select: 'name doctorTitle profileImg' },
      { path: 'patient', select: 'name profileImg' },
    ])
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()

  const result = await paymentQuery?.queryModel
  const total = await Payment.countDocuments(
    paymentQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getPaymentById = async (id: string) => {
  const payment = await Payment.findById(id)
    .select('-__v')
    .populate('appointment', '-createdAt -updatedAt -__v')
  if (!payment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Payment not found')
  }
  return payment
}

export const paymentService = {
  initPayment,
  getAllPayment,
  getPaymentById,
}
