import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import User from '../user/user.model'
import { TLoginUser, TPasswordUpdate, TResetPassword } from './auth.interface'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { sendEmail } from '../../utils/sendEmail'
import Doctor from '../doctor/doctor.model'
import { TDoctor } from '../doctor/doctor.interface'
import Patient from '../patient/patient.model'
import { TPatient } from '../patient/patient.interface'
import Admin from '../admin/admin.model'
import { TAdmin } from '../admin/admin.interface'

const login = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email })
  let updatedUser

  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User not found!')
  }
  if (user?.status === 'inactive') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!')
  }

  const isDoctor = user?.role === 'doctor'
  const isPatient = user?.role === 'patient'
  const isAdmin = user?.role === 'admin'
  if (isDoctor) {
    const doctor = (await Doctor.findOne({ user: user?._id })) as TDoctor
    const doctorStatus = doctor?.status
    const isDoctorDeleted = doctor?.isDeleted
    if (isDoctorDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This doctor is deleted!')
    }
    if (doctorStatus !== 'approve') {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        doctorStatus === 'pending'
          ? `Dear ${doctor.doctorTitle} ${doctor.name}, wait for admin approval. You will be notified via email!'`
          : 'Your account is rejected by admin!',
      )
    }
    updatedUser = {
      _id: user?._id,
      email: user?.email,
      role: user?.role,
      profileImg: doctor.profileImg,
    }
  }
  if (isPatient) {
    const patient = (await Patient.findOne({ user: user?._id })) as TPatient
    const isPatientDeleted = patient?.isDeleted
    if (isPatientDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This patient is deleted!')
    }

    updatedUser = {
      _id: user?._id,
      email: user?.email,
      role: user?.role,
      profileImg: patient.profileImg,
    }
  }
  if (isAdmin) {
    const admin = (await Admin.findOne({ user: user?._id })) as TAdmin
    const isAdminDeleted = admin?.isDeleted
    if (isAdminDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, 'This admin is deleted!')
    }
    updatedUser = {
      _id: user?._id,
      email: user?.email,
      role: user?.role,
      profileImg: admin.profileImg,
    }
  }

  const decryptPass = await bcrypt.compare(payload.password, user.password)

  if (!decryptPass) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Incorrect password!')
  }

  const jwtPayload = {
    _id: updatedUser?._id,
    email: updatedUser?.email,
    role: updatedUser?.role,
    profileImg: updatedUser?.profileImg,
  }

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
    },
  )

  const refreshToken = jwt.sign(
    jwtPayload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN as string,
    },
  )

  return {
    accessToken,
    refreshToken,
    data: user,
    needsPasswordChange: user?.needsPasswordChange,
  }
}

const refreshToken = async (token: string) => {
  // checking if the given token is valid

  let decoded
  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as JwtPayload
  } catch (e: any) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
  }

  const { email } = decoded

  // checking if the user is exist
  const user = await User.findOne({ email })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This user is not found !')
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted !')
  }

  if (user.status === 'inactive') {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is not active!')
  }
  if (user.isDeleted) {
    throw new AppError(StatusCodes.FORBIDDEN, 'This user is deleted!')
  }

  const jwtPayload = { _id: user?._id, email: user.email, role: user.role }

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN as string,
    },
  )

  return {
    accessToken,
  }
}

const forgetPassword = async (payload: Record<string, unknown>) => {
  const user = await User.findOne({ email: payload.email })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }
  const jwtPayload = { _id: user?._id, email: user.email, role: user.role }

  const accessToken = jwt.sign(
    jwtPayload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: '10m' as string,
    },
  )
  const resetLink = `${process.env.CLIENT_URL}/reset-password?email=${user.email}&token=${accessToken}`
  await sendEmail({
    toEmail: user.email,
    subject: 'Reset your password for Doc Eye!',
    text: `You requested a password reset for your account. Please click the link below to reset your password:
    ${resetLink} This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.`,
    html: `
    <p>You requested a password reset for your account.</p>

    <p>Please click the link below to reset your password:</p>

 <div>
    <a href="${resetLink}" style="background-color: #05668D; margin: 5px 0; cursor: pointer; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; display: inline-block;">Reset Password</a>
  </div>

    <p>This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
    `,
  })
  return { resetLink }
}

const resetPassword = async (
  payload: TResetPassword,
  jwtPayload: JwtPayload,
) => {
  const user = await User.findOne({ email: payload.email })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }

  if (jwtPayload.email != user.email) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'You are not authorized to reset password for this user',
    )
  }

  const hashedPass = await bcrypt.hash(
    payload.newPassword,
    Number(process.env.SALT_ROUNDS),
  )

  const result = await User.findOneAndUpdate(
    { email: payload.email },
    { password: hashedPass, needsPasswordChange: false },
    { new: true },
  ).select('-password')
  if (!result) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update password.',
    )
  }
  return result
}

const changePassword = async (
  userPayload: JwtPayload,
  payload: TPasswordUpdate,
) => {
  const user = await User.findOne({ email: userPayload.email })

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!')
  }

  const decryptPass = await bcrypt.compare(payload.oldPassword, user.password)
  if (!decryptPass) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Password is not match')
  }

  const hashedPass = await bcrypt.hash(
    payload.newPassword,
    Number(process.env.SALT_ROUNDS),
  )

  const result = await User.findOneAndUpdate(
    { email: userPayload.email },
    { password: hashedPass, needsPasswordChange: false },
    { new: true },
  ).select('-password')
  if (!result) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update password.',
    )
  }
  return result
}

export const authServices = {
  login,
  refreshToken,
  forgetPassword,
  resetPassword,
  changePassword,
}
