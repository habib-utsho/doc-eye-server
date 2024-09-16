import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'
import Doctor from './doctor.model'
import { doctorSearchableFields } from './doctor.constant'
import { TDoctor } from './doctor.interface'

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
    .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }])

  const result = await doctorQuery?.queryModel
  const total = await Doctor.countDocuments(doctorQuery.queryModel.getFilter())
  return { data: result, total }
}

const getDoctorById = async (id: string) => {
  const student = await Doctor.findOne({ id })
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v')
  return student
}

// const updateDoctorById = async (id: string, payload: Partial<TDoctor>) => {
//   const { name, guardian, ...restStudentData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restStudentData,
//   }

//   // update non primitive values
//   // Update name
//   if (name && Object.keys(name)?.length > 0) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value
//     }
//   }
//   // update guardian
//   if (guardian && Object.keys(guardian)?.length > 0) {
//     for (const [key, value] of Object.entries(guardian)) {
//       modifiedUpdatedData[`guardian.${key}`] = value
//     }
//   }

//   const student = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')

//   return student
// }

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
  // updateDoctorById,
  deleteDoctorById,
}
