import { Types } from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { patientSearchableFields } from './patient.constant'
import Patient from './patient.model' // Import Patient model
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'

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
    .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }, {
      path: 'favoriteDoctors', select: '-createdAt -updatedAt -__v',
      // populate: {
      //   path: 'medicalSpecialties',
      //   select: '-createdAt -updatedAt -__v',
      // },
    }])

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
    .populate({
      path: 'favoriteDoctors',
      select: '-createdAt -updatedAt -__v',
      populate: {
        path: 'medicalSpecialties',
        select: '-createdAt -updatedAt -__v',
      },
    });
  return patient
}


const updateFavoriteDoctors = async (patientId: string, doctorId: string) => {
  const patient = await Patient.findById(patientId);
  if (!patient) {
    throw new AppError(StatusCodes.NOT_FOUND, "Patient not found");
  }
  // Convert incoming doctorId string to a mongoose ObjectId for safe comparison/push
  const doctorObjectId = new Types.ObjectId(doctorId);

  // Check 10 favorite doctors limit
  if (!patient.favoriteDoctors.some(
    (favDoctorId) => favDoctorId.toString() === doctorId
  ) && patient.favoriteDoctors.length >= 10) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You can only have up to 10 favorite doctors.");

  }


  // Check if the doctor is already in favoriteDoctors (compare by string form)
  const isFavorite = patient.favoriteDoctors.some(
    (favDoctorId) => favDoctorId.toString() === doctorId
  );
  const message = isFavorite ? "Doctor removed from favorites" : "Doctor added to favorites";
  if (isFavorite) {
    // Remove doctor from favoriteDoctors
    patient.favoriteDoctors = patient.favoriteDoctors.filter(
      (favDoctorId) => favDoctorId.toString() !== doctorId
    );
  } else {
    // Add doctor to favoriteDoctors
    patient.favoriteDoctors.push(doctorObjectId);
  }
  await patient.save();
  return { patient, message };
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
  updateFavoriteDoctors
}
