import { Types } from 'mongoose'

type TUserRole = 'admin' | 'doctor' | 'patient'
type TUser = {
  _id: Types.ObjectId
  email: string
  password: string
  needsPasswordChange: boolean
  role: TUserRole
  status: 'active' | 'inactive'
  isDeleted: boolean
}

export { TUser, TUserRole }
