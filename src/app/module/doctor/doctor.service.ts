import QueryBuilder from '../../builder/QueryBuilder'
import Doctor from './doctor.model'
import { doctorSearchableFields } from './doctor.constant'
import { TDoctor } from './doctor.interface'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'
import moment from 'moment'
import Specialty from '../specialty/specialty.model'
import jwt from 'jsonwebtoken'


const getAllDoctor = async (query: Record<string, unknown>) => {
  const availabilityQuery = query.availability;
  delete query.availability


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

  let result = await doctorQuery?.queryModel


  // Apply custom filtering based on availability
  if (availabilityQuery == "online_now" || availabilityQuery == " available_today" || availabilityQuery == "available_in_next_three_days" || availabilityQuery == "available_in_next_seven_days") {
    const now = moment()
    const todayDay = now.format('dddd')
    const currentTime = now.format('HH:mm')


    result = result.filter((doc: any) => {
      const { availability } = doc
      if (!availability) return false

      const { dayStart, dayEnd, timeStart, timeEnd } = availability
      const daysOfWeek = [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ]
      const getDayIndex = (day: string) => daysOfWeek.indexOf(day)
      const dayStartIndex = getDayIndex(dayStart)
      const dayEndIndex = getDayIndex(dayEnd)
      const todayIndex = getDayIndex(todayDay)

      const isWithinDayRange = (dayIndex: number) => {
        if (dayStartIndex <= dayEndIndex) {
          return dayIndex >= dayStartIndex && dayIndex <= dayEndIndex
        } else {
          // Week wraps around
          return dayIndex >= dayStartIndex || dayIndex <= dayEndIndex
        }
      }

      // Online now: doctor is available today AND current time is within the time window
      if (availabilityQuery == "online_now") {
        if (!isWithinDayRange(todayIndex)) return false
        return currentTime >= timeStart && currentTime <= timeEnd
      }

      // Available today
      if (availabilityQuery == "available_today") {
        return isWithinDayRange(todayIndex)
      }

      // Available in next N days
      if (availabilityQuery == "available_in_next_three_days" || availabilityQuery == "available_in_next_seven_days") {
        const range = availabilityQuery == "available_in_next_three_days" ? 3 : 7
        for (let i = 0; i < range; i++) {
          const futureDay = now.add(i, 'day').format('dddd')
          const futureDayIndex = getDayIndex(futureDay)
          if (isWithinDayRange(futureDayIndex)) return true
        }
        return false
      }

      return true
    })
  }


  // const total = await Doctor.countDocuments(doctorQuery.queryModel.getFilter())
  return { data: result, total: result.length }
}

const getDoctorById = async (id: string) => {
  const customDoctorId = id.startsWith("DE-")
  const doctor = await (customDoctorId ? Doctor.find({ doctorCode: id }) : Doctor.findById(id))
    .select('-__v')
    .populate([
      { path: 'user', select: '-createdAt -updatedAt -password -__v' },
      { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ])
  return doctor
}
const getDoctorByDoctorCode = async (id: string) => {
  const doctor = await Doctor.findOne({ doctorCode: id })
    .select('-__v')
    .populate([
      { path: 'user', select: '-createdAt -updatedAt -password -__v' },
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
    currentWorkplace,
    workingExperiences,
    medicalSpecialties,
    ...restDoctorData
  } = payload
  const modifiedUpdatedData: Record<string, unknown> = {
    ...restDoctorData,
  }

  // console.log(payload);
  // update non primitive values
  // Update availability
  if (availability && Object.keys(availability)?.length > 0) {
    for (const [key, value] of Object.entries(availability)) {
      modifiedUpdatedData[`availability.${key}`] = value
    }
  }
  // Update currentWorkplace
  if (currentWorkplace && Object.keys(currentWorkplace)?.length > 0) {
    for (const [key, value] of Object.entries(currentWorkplace)) {
      modifiedUpdatedData[`currentWorkplace.${key}`] = value
    }
  }

  // Update/replace entire workingExperiences
  if (Array.isArray(workingExperiences)) {
    modifiedUpdatedData.workingExperiences = workingExperiences
  }


  // console.log(modifiedUpdatedData);


  if (payload.followupFee && payload.consultationFee && (payload?.followupFee > payload?.consultationFee)) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Follow up fee should be less than or equal to consultation fee")
  }


  // Validate medicalSpecialties IDs
  const validSpecialties = await Specialty.find({
    _id: { $in: payload.medicalSpecialties },
  }).select('_id')

  if (validSpecialties?.length !== medicalSpecialties?.length) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'One or more medical specialty IDs are invalid!',
    )
  }
  modifiedUpdatedData.medicalSpecialties = medicalSpecialties;

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
    .populate('user', '-createdAt -updatedAt -__v')
    .populate('medicalSpecialties')




  const jwtPayload = {
    userId: (doctor?.user as { _id: string })._id,
    _id: doctor?._id,
    email: doctor?.email,
    role: 'doctor',
    name: doctor?.name,
    profileImg: doctor?.profileImg,
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


  return { doctor, accessToken, refreshToken }
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
