import QueryBuilder from '../../builder/QueryBuilder'
import { patientSearchableFields } from './patient.constant'
import Patient from './patient.model' // Import Patient model

const getAllPatients = async (query: Record<string, unknown>) => {
  const patientQuery = new QueryBuilder(Patient.find(), {
    ...query,
    sort: `${query.sort} isDeleted`,
  })
    .searchQuery(patientSearchableFields) // Use the Patient searchable fields
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }])

  const result = await patientQuery?.queryModel
  const total = await Patient.countDocuments(
    patientQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getPatientById = async (id: string) => {
  const patient = await Patient.findOne({ _id: id }) // Use _id instead of id
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -__v')
  return patient
}

// const updatePatientById = async (id: string, payload: Partial<TPatient>) => {
//   const { name, guardian, ...restPatientData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restPatientData,
//   }

//   // update non-primitive values
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

//   const patient = await Patient.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')

//   return patient
// }

const deletePatientById = async (id: string) => {
  const patient = await Patient.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return patient
}

export const patientServices = {
  // Change export name to patientServices
  getAllPatients, // Change to getAllPatients
  getPatientById, // Change to getPatientById
  // updatePatientById, // Change to updatePatientById
  deletePatientById, // Change to deletePatientById
}
