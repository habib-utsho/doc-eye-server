/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose'
import { TUser } from './user.interface'
import bcrypt from 'bcrypt'

const UserSchema = new Schema<TUser>(
  {
    email: { type: String, unique: true, trim: true, required: true },
    password: { type: String, required: [true, 'Password is required'] },
    needsPasswordChange: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ['admin', 'doctor', 'patient'],
      required: true,
    },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
)

UserSchema.pre<TUser>(
  'save',
  async function (this: TUser, next: (err?: any) => void) {
    try {
      const user = await User.findById(this?._id)
      if (user && user.password === this.password) {
        return next()
      }
      const hashPass = await bcrypt.hash(
        this.password,
        Number(process.env.SALT_ROUNDS),
      )

      this.password = hashPass
      next()
    } catch (e: any) {
      next(e)
    }
  },
)

const User = model<TUser>('User', UserSchema)
export default User
