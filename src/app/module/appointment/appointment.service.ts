import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import { TAppointment } from './appointment.interface'
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

  delete query.date

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
  payload: { status: 'completed' | 'canceled' },
) => {
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
