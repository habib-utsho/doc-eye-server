import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import MedicalReport from './medicalReport.model'
import QueryBuilder from '../../builder/QueryBuilder'
import Appointment from '../appointment/appointment.model'
import { TMedicalReport } from './medicalReport.interface'
import { JwtPayload } from 'jsonwebtoken'
import Patient from '../patient/patient.model'

const createMedicalReport = async (
  payload: TMedicalReport,
  user: JwtPayload,
) => {
  // Ensure patient exists
  const patient = await Patient.findById(user._id)
  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Patient not found')
  }

  // Ensure appointment exists
  const appointmentExists = await Appointment.findById(payload.appointment)
  if (!appointmentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Appointment not found')
  }

  if (appointmentExists.doctor.toString() !== user._id) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      'You are not authorized to create this medical report',
    )
  }

  if (appointmentExists.status !== 'confirmed') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Medical report can only be created for confirmed appointments',
    )
  }

  // Create medical report
  const report = await MedicalReport.create(payload)

  return report
}

const getAllMedicalReports = async (query: Record<string, unknown>) => {
  const reportQuery = new QueryBuilder(MedicalReport.find(), {
    ...query,
    sort: `${query.sort}`,
  })
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'doctor', select: '_id doctorTitle name profileImg email' },
      { path: 'patient', select: '_id name profileImg email' },
      { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await reportQuery.queryModel
  const total = await MedicalReport.countDocuments(
    reportQuery.queryModel.getFilter(),
  )

  return { data: result, total }
}

const getMedicalReportById = async (id: string) => {
  const report = await MedicalReport.findById(id)
    .select('-__v')
    .populate('doctor', '_id doctorTitle name profileImg email')
    .populate('patient', '_id name profileImg email')
    .populate('appointment', '-createdAt -updatedAt -__v')

  if (!report) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Medical report not found')
  }

  return report
}

export const medicalReportService = {
  createMedicalReport,
  getAllMedicalReports,
  getMedicalReportById,
}
