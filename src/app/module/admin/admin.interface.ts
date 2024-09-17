import { Types } from 'mongoose'
import { TDistrict, TGender } from '../patient/patient.interface'

export type TAdmin = {
  user: Types.ObjectId
  name: string
  email: string
  phone: string
  gender: TGender
  profileImg?: string
  dateOfBirth: Date
  district: TDistrict
  nid: number
  isDeleted: boolean
}
