import { StatusCodes } from 'http-status-codes'
import { TUser } from './user.interface'
import User from './user.model'
import AppError from '../../errors/appError'
import mongoose from 'mongoose'
import { JwtPayload } from 'jsonwebtoken'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'

const insertPatient = async (file: any, payload:  & TUser) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Student.findOne({ email: payload.email })
    const alreadyExistNid = await Student.findOne({ nid: payload.nid })
    const alreadyExistPhone = await Student.findOne({ phone: payload.phone })
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

    const academicDepartment = await AcademicDepartment.findById(
      payload.academicInfo.department,
    )
    const totalStudent = await Student.countDocuments({}).exec()
    const batch = await Batch.findById(payload.academicInfo?.batch)
    const deptExistInBatch = await Batch.findOne({
      department: payload.academicInfo.department,
      _id: payload.academicInfo.batch,
    })

    // console.log(department, 'department');
    // console.log(totalStudent, 'totalStudent');

    if (!academicDepartment) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Department not found')
    }
    if (!batch) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Batch not found')
    }
    if (!deptExistInBatch) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Department does not match with batch. Please provide correct batch and department ID.',
      )
    }

    // Update regSlNo and regCode and id
    const regSlNo = totalStudent > 0 ? totalStudent + 1 : 1
    const regCode = `${academicDepartment.shortName}-${batch?.batch}-${regSlNo}`
    payload.academicInfo.regSlNo = regSlNo
    payload.academicInfo.regCode = regCode
    payload.id = regCode

    // file upload
    const cloudinaryRes = await uploadImgToCloudinary(
      `${regCode}-${payload.name.firstName}-${payload.name.lastName}`,
      file.path,
    )
    if (cloudinaryRes) {
      payload.profileImg = cloudinaryRes.secure_url
    }

    // Check if batch has reached the maximum student limit
    const maxStudentsPerBatch = Number(process.env.MAX_STUDENT_PER_BATCH) || 45 // Default to 45 if not set
    if (batch.totalStudent >= maxStudentsPerBatch) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Batch is full')
    }

    // Update roll and totalStudent of batch
    payload.academicInfo.roll = batch.totalStudent + 1
    batch.totalStudent += 1
    await batch.save({ session })

    // Update totalStudent of department
    academicDepartment.totalStudent += 1
    await academicDepartment.save({ session })

    const userData: Partial<TUser> = {
      id: regCode,
      email: payload.email,
      password: payload.password || process.env.STUDENT_DEFAULT_PASSWORD,
      needsPasswordChange: true,
      role: 'student',
    }
    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
    }

    const studentData: Partial<TStudent> = {
      ...payload,
      id: regCode,
      user: user[0]._id,
      academicInfo: { ...payload.academicInfo },
    }
    // Save student
    const student = await Student.create([studentData], { session })
    if (!student?.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to insert student to db',
      )
    }

    await session.commitTransaction()
    await session.endSession()
    return student[0]
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const insertFacultyToDb = async (payload: TFaculty & TUser) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Faculty.findOne({ email: payload.email })
    const alreadyExistNid = await Faculty.findOne({ nid: payload.nid })
    const alreadyExistPhone = await Faculty.findOne({ phone: payload.phone })
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

    const department = await AcademicDepartment.findById(
      payload.academicDepartment,
    )
    const totalFaculty = await Faculty.countDocuments({}).exec()
    if (!department) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Department not found')
    }

    // Update id
    const slNo = totalFaculty > 0 ? totalFaculty + 1 : 1
    const id = `F-${department.shortName}-${slNo.toString().padStart(4, '0')}`

    // Update totalFaculty of department
    department.totalFaculty += 1
    await department.save({ session })

    const userData: Partial<TUser> = {
      id,
      email: payload.email,
      password: payload.password || process.env.FACULTY_DEFAULT_PASSWORD,
      needsPasswordChange: true,
      role: 'faculty',
    }
    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
    }

    const facultyData: Partial<TFaculty> = {
      ...payload,
      id,
      user: user[0]._id,
    }
    // Save faculty
    const faculty = await Faculty.create([facultyData], { session })
    if (!faculty?.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to insert faculty to db',
      )
    }

    await session.commitTransaction()
    return faculty[0]
  } catch (err: any) {
    await session.abortTransaction()
    throw new Error(err)
  } finally {
    await session.endSession()
  }
}

const insertAdminToDb = async (payload: TAdmin & TUser) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const alreadyExistEmail = await Faculty.findOne({ email: payload.email })
    const alreadyExistNid = await Faculty.findOne({ nid: payload.nid })
    const alreadyExistPhone = await Faculty.findOne({ phone: payload.phone })
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

    const totalAdmin = await Admin.countDocuments({}).exec()

    // Update id
    const slNo = totalAdmin > 0 ? totalAdmin + 1 : 1
    const id = `A-${slNo.toString().padStart(4, '0')}`

    const userData: Partial<TUser> = {
      id,
      email: payload.email,
      password: payload.password || process.env.ADMIN_DEFAULT_PASSWORD,
      role: 'admin',
    }

    // Save user
    const user = await User.create([userData], { session })
    if (!user?.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
    }

    const adminData: Partial<TAdmin> = {
      ...payload,
      id,
      user: user[0]._id,
    }
    // Save admin
    const admin = await Admin.create([adminData], { session })
    if (!admin?.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to insert admin to db',
      )
    }

    await session.commitTransaction()
    return admin[0]
  } catch (err: any) {
    await session.abortTransaction()
    throw new Error(err)
  } finally {
    await session.endSession()
  }
}

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
  if (payload.role === 'student') {
    result = await Student.findOne({ id: payload.id }).select('-__v')
  }
  if (payload.role === 'faculty') {
    result = await Faculty.findOne({ id: payload.id }).select('-__v')
  }
  if (payload.role === 'admin') {
    result = await Admin.findOne({ id: payload.id }).select('-__v')
  }

  return result
}

export const userServices = {
  insertStudentToDb: insertPatient,
  insertFacultyToDb,
  insertAdminToDb,
  getAllUser,
  getSingleUserById,
  getMe,
}
