import mongoose, { Types } from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { patientSearchableFields } from './patient.constant'
import Patient from './patient.model' // Import Patient model
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'
import User from '../user/user.model'
import Admin from '../admin/admin.model'
import { TPatient } from './patient.interface'
import Doctor from '../doctor/doctor.model'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import jwt from 'jsonwebtoken'


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
    .populate('user', '-createdAt -updatedAt -password -__v')
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



const makePatientAdmin = async (patientId: string) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find patient and linked user
    const patient = await Patient.findById(patientId).session(session);
    if (!patient) throw new Error("Patient not found");

    const user = await User.findById(patient.user).session(session);
    if (!user) throw new Error("User not found");

    // 1️⃣ Update user role
    user.role = "admin";
    await user.save({ session });


    const adminData = patient.toObject();
    // now create admin
    const admin = await Admin.create([adminData], { session });


    // 3️⃣ Optional: remove from patient collection
    await Patient.deleteOne({ _id: patientId }, { session });

    await session.commitTransaction();
    return admin[0];
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(StatusCodes.NOT_FOUND, error);

  } finally {
    session.endSession();
  }
};


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

const updatePatientById = async (id: string, file: any, payload: Partial<TPatient>) => {

  // console.log({ file, payload });


  const { favoriteDoctors, ...restPatientData } = payload
  const modifiedUpdatedData: Record<string, unknown> = {
    ...restPatientData,
  }


  // Non primitive handle
  // Fav doctors handled by different api, but if client side provides fav doctors when user update then verify it for safety. so it possible to update fav doctors when user updates also.
  if (favoriteDoctors) {
    if (!Array.isArray(favoriteDoctors)) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Favorite doctors should be an array")
    }
    // Validate fav doctors IDs
    const validFavDoctors = await Doctor.find({
      _id: { $in: favoriteDoctors },
    }).select('_id')

    if (validFavDoctors?.length !== favoriteDoctors?.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'One or more fav doctors IDs are invalid!',
      )
    }
    throw new AppError(StatusCodes.BAD_REQUEST, "Favorite doctors should be an array")
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


  const patient = await Patient.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  })
    .select('-__v')
    .populate('user', '-createdAt -updatedAt -password -__v')



  const jwtPayload = {
    userId: patient?.user?._id,
    _id: patient?._id,
    email: patient?.email,
    role: 'patient',
    name: patient?.name,
    profileImg: patient?.profileImg,
  }



  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
    } as jwt.SignOptions,
  )

  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
    } as jwt.SignOptions,
  )


  return { patient, accessToken, refreshToken }
}

const deletePatientById = async (id: string) => {
  const patient = await Patient.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return patient
}

export const patientServices = {
  getAllPatients,
  getPatientById,
  updatePatientById,
  makePatientAdmin,
  deletePatientById,
  updateFavoriteDoctors
}
