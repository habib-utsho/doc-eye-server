import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import { TPayment } from './payment.interface'
import Payment from './payment.model'
import QueryBuilder from '../../builder/QueryBuilder'

const createPayment = async (payload: TPayment) => {
  const result = await Payment.create(payload)
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Payment not created')
  }
  return result
}

const getAllPayment = async (query: Record<string, unknown>) => {
  const paymentQuery = new QueryBuilder(Payment.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ])

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

const updatePayment = async (id: string, payload: TPayment) => {
  const result = await Payment.findByIdAndUpdate(id, payload, {
    new: true,
  })
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Payment not updated')
  }
  return result
}

export const paymentService = {
  createPayment,
  updatePayment,
  getAllPayment,
  getPaymentById,
}
