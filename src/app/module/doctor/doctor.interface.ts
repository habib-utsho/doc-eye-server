import { Types } from 'mongoose'
import { TBloodGroup, TDistrict, TGender } from '../patient/patient.interface'
export type TDoctorTitle =
  | 'Dr.'
  | 'Prof. Dr.'
  | 'Assoc. Prof. Dr.'
  | 'Asst. Prof. Dr.'
export type TDoctorType = 'Medical' | 'Dental' | 'Veterinary'

export type TDoctor = {
  _id: Types.ObjectId
  user: Types.ObjectId
  name: string
  email: string
  phone: string
  gender: TGender
  bloodGroup: TBloodGroup
  profileImg?: string
  bio: string
  doctorTitle: TDoctorTitle
  doctorType: TDoctorType
  medicalSpecialty: Types.ObjectId[]
  totalExperienceYear: number
  medicalDegree: string
  consultationFee: number
  followupFee: number
  workingExperiences: {
    workPlace: string
    department: string
    designation: string
    workingPeriod: string
  }[]
  dateOfBirth: Date
  currentWorkplace: string
  availability: {
    dayStart: string
    dayEnd: string
    timeStart: string
    timeEnd: string
  }
  district: TDistrict
  nid: string
  bmdc: string
  patientAttended: number
  status: 'pending' | 'approve' | 'reject'
  doctorCode: string
  isDeleted: boolean
}
