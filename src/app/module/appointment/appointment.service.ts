import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import Appointment from './appointment.model'
import QueryBuilder from '../../builder/QueryBuilder'

const getAllAppointments = async (query: Record<string, unknown>) => {
  const dateFilter: any = {}
  if (query.date) {
    const date = new Date(query.date as string)
    const nextDay = new Date(date)

    nextDay.setDate(date.getDate() + 1)

    dateFilter.schedule = {
      $gte: date.toISOString(),
      $lt: nextDay.toISOString(),
    }
  }

  if (query.state) {
    const currentDate = new Date()
    currentDate.setHours(currentDate.getHours() + 6) // Convert to GMT+6
    if (query.state === 'upcoming') {
      dateFilter.schedule = { $gte: currentDate }
    } else if (query.state === 'expired') {
      dateFilter.schedule = { $lt: currentDate }
    }
  }

  delete query.date
  delete query.state

  const appointmentQuery = new QueryBuilder(Appointment.find(), {
    ...query,
    ...dateFilter,
    sort: `${query.sort}`,
  })
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'doctor', select: '-createdAt -updatedAt -__v' },
      { path: 'patient', select: '-createdAt -updatedAt -__v' },
      { path: 'payment', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await appointmentQuery?.queryModel
  const total = await Appointment.countDocuments(
    appointmentQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getAppointmentById = async (id: string) => {
  const appointment = await Appointment.findById(id)
    .select('-__v')
    .populate('doctor', '-createdAt -updatedAt -__v')
    .populate('patient', '-createdAt -updatedAt -__v')
    .populate('payment', '-createdAt -updatedAt -__v')

  if (!appointment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Appointment not found')
  }
  return appointment
}

const updateAppointmentStatusById = async (
  id: string,
  payload: { status: 'confirmed' | 'completed' | 'canceled' },
) => {
  const appointment = await Appointment.findById(id)

  if (!appointment) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Appointment not found')
  }
  if (appointment.status === 'completed' || appointment.status === 'canceled') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Appointment is already ${appointment.status}`,
    )
  }

  if (
    appointment.status === 'pending' &&
    !['confirmed', 'canceled'].includes(payload.status)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Status is either confirmed or canceled while appointment is pending',
    )
  }

  if (
    appointment.status === 'confirmed' &&
    !['completed', 'canceled'].includes(payload.status)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Status is either completed or canceled while appointment is confirmed',
    )
  }

  if (appointment.status === 'confirmed' && payload.status === 'completed') {
    const appointmentScheduleTime = new Date(appointment.schedule).getTime()
    const currentTime = new Date().getTime()
    const diff = appointmentScheduleTime - currentTime
    if (diff > 0) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Only completed status is allowed after appointment time',
      )
    }
  }

  const result = await Appointment.findByIdAndUpdate(
    id,
    { status: payload.status },
    {
      new: true,
    },
  )
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Appointment not updated')
  }
  return result
}

export const appointmentService = {
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatusById,
}
