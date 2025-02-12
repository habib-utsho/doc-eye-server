import QueryBuilder from '../../builder/QueryBuilder'
import Doctor from './doctor.model'
import { doctorSearchableFields } from './doctor.constant'
import { TDoctor } from './doctor.interface'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'

const getAllDoctor = async (query: Record<string, unknown>) => {
  const doctorQuery = new QueryBuilder(Doctor.find(), {
    ...query,
    sort: `${query.sort} isDeleted`,
  })
    .searchQuery(doctorSearchableFields)
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([
      { path: 'user', select: '-createdAt -updatedAt -__v' },
      { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ])

  const result = await doctorQuery?.queryModel
  const total = await Doctor.countDocuments(doctorQuery.queryModel.getFilter())
  return { data: result, total }
}

const getDoctorById = async (id: string) => {
  const doctor = await Doctor.findById(id)
    .select('-__v')
    .populate([
      { path: 'user', select: '-createdAt -updatedAt -__v' },
      { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ])
  return doctor
}
const getDoctorByDoctorCode = async (id: string) => {
  const doctor = await Doctor.findOne({ doctorCode: id })
    .select('-__v')
    .populate([
      { path: 'user', select: '-createdAt -updatedAt -__v' },
      { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ])
  if (!doctor) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Doctor not found!')
  }
  return doctor
}

// TODO: need to handle workingExperiences and medicalSpecialties for update doctor
const updateDoctorById = async (
  id: string,
  file: any,
  payload: Partial<TDoctor>,
) => {
  const {
    availability,
    workingExperiences,
    medicalSpecialties,
    ...restDoctorData
  } = payload
  const modifiedUpdatedData: Record<string, unknown> = {
    ...restDoctorData,
  }

  // update non primitive values
  // Update availability
  if (availability && Object.keys(availability)?.length > 0) {
    for (const [key, value] of Object.entries(availability)) {
      modifiedUpdatedData[`availability.${key}`] = value
    }
  }

  // file upload
  if (file?.path) {
    const cloudinaryRes = await uploadImgToCloudinary(
      `${payload.name}-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes?.secure_url) {
      modifiedUpdatedData.profileImg = cloudinaryRes.secure_url
    }
  }

  const doctor = await Doctor.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  })
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v -department')
    .populate('medicalSpecialties')

  return doctor
}

const deleteDoctorById = async (id: string) => {
  const student = await Doctor.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return student
}

export const doctorServices = {
  getAllDoctor,
  getDoctorById,
  getDoctorByDoctorCode,
  updateDoctorById,
  deleteDoctorById,
}
