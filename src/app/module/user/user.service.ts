import { StatusCodes } from 'http-status-codes'
import { TUser } from './user.interface'
import User from './user.model'
import AppError from '../../errors/appError'
import mongoose from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import { TPatient } from '../patient/patient.interface'
import Patient from '../patient/patient.model'
import { TDoctor } from '../doctor/doctor.interface'
import Doctor from '../doctor/doctor.model'

const insertPatient = async (file: any, payload: TPatient & Partial<TUser>) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Patient.findOne({ email: payload.email })
    if (alreadyExistEmail) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Email is already exist. Try with different email!',
      )
    }

    // file upload
    const cloudinaryRes = await uploadImgToCloudinary(
      `${payload.name}-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes) {
      payload.profileImg = cloudinaryRes.secure_url
    }

    const userData: Partial<TUser> = {
      email: payload.email,
      password: payload.password,
      needsPasswordChange: false,
      role: 'patient',
    }
    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
    }

    const patientData: Partial<TPatient> = {
      ...payload,
      user: user[0]._id,
    }
    // Save patient
    const patient = await Patient.create([patientData], { session })
    if (!patient?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert patient!')
    }

    await session.commitTransaction()
    await session.endSession()
    return patient[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const insertDoctor = async (
  file: any,
  payload: TDoctor & Omit<TUser, 'status'>,
) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Doctor.findOne({ email: payload.email })
    const alreadyExistNid = await Doctor.findOne({ nid: payload.nid })
    const alreadyExistPhone = await Doctor.findOne({ phone: payload.phone })

    if (alreadyExistEmail) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Email is already exist. Try with different email!',
      )
    }
    if (alreadyExistNid) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'NID is already exist. Try with different NID!',
      )
    }
    if (alreadyExistPhone) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Phone is already exist. Try with different phone!',
      )
    }

    const totalDoctor = await Doctor.countDocuments({}).exec()

    // Update id
    const slNo = totalDoctor > 0 ? totalDoctor + 1 : 1
    const doctorCode = `DE-${slNo.toString().padStart(4, '0')}`

    const userData: Partial<TUser> = {
      email: payload.email,
      password: payload.password || process.env.DOCTOR_DEFAULT_PASSWORD,
      needsPasswordChange: true,
      role: 'doctor',
    }
    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user!')
    }

    const doctorData: Partial<TDoctor> = {
      ...payload,
      doctorCode,
      user: user[0]._id,
    }
    // Save doctor
    const doctor = await Doctor.create([doctorData], { session })
    if (!doctor?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert doctor!')
    }

    await session.commitTransaction()
    return doctor[0]
  } catch (err: any) {
    await session.abortTransaction()
    throw new Error(err)
  } finally {
    await session.endSession()
  }
}

// const insertAdminToDb = async (payload: TAdmin & TUser) => {
//   const session = await mongoose.startSession()

//   try {
//     session.startTransaction()

//     const alreadyExistEmail = await Faculty.findOne({ email: payload.email })
//     const alreadyExistNid = await Faculty.findOne({ nid: payload.nid })
//     const alreadyExistPhone = await Faculty.findOne({ phone: payload.phone })
//     if (alreadyExistEmail) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Email is already exist. Try with different email!',
//       )
//     }
//     if (alreadyExistNid) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'NID is already exist. Try with different NID!',
//       )
//     }
//     if (alreadyExistPhone) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Phone is already exist. Try with different phone!',
//       )
//     }

//     const totalAdmin = await Admin.countDocuments({}).exec()

//     // Update id
//     const slNo = totalAdmin > 0 ? totalAdmin + 1 : 1
//     const id = `A-${slNo.toString().padStart(4, '0')}`

//     const userData: Partial<TUser> = {
//       id,
//       email: payload.email,
//       password: payload.password || process.env.ADMIN_DEFAULT_PASSWORD,
//       role: 'admin',
//     }

//     // Save user
//     const user = await User.create([userData], { session })
//     if (!user?.length) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
//     }

//     const adminData: Partial<TAdmin> = {
//       ...payload,
//       id,
//       user: user[0]._id,
//     }
//     // Save admin
//     const admin = await Admin.create([adminData], { session })
//     if (!admin?.length) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Failed to insert admin to db',
//       )
//     }

//     await session.commitTransaction()
//     return admin[0]
//   } catch (err: any) {
//     await session.abortTransaction()
//     throw new Error(err)
//   } finally {
//     await session.endSession()
//   }
// }

const getAllUser = async () => {
  const users = await User.find({}).select('-__v')
  return users
}

const getSingleUserById = async (id: string) => {
  const user = await User.findById(id).select('-__v')
  return user
}

const getMe = async (payload: JwtPayload) => {
  let result
  if (payload.role === 'doctor') {
    result = await Doctor.findOne({ id: payload.id }).select('-__v')
  }
  if (payload.role === 'patient') {
    result = await Patient.findOne({ id: payload.id }).select('-__v')
  }
  // if (payload.role === 'admin') {
  //   result = await Admin.findOne({ id: payload.id }).select('-__v')
  // }

  return result
}

export const userServices = {
  insertPatient,
  insertDoctor,
  // insertAdminToDb,
  getAllUser,
  getSingleUserById,
  getMe,
}
