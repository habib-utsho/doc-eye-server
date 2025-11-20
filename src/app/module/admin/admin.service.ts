
import QueryBuilder from '../../builder/QueryBuilder'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import { adminSearchableFields } from './admin.constant'
import { TAdmin } from './admin.interface'
import Admin from './admin.model'
import jwt from 'jsonwebtoken'


const getAllAdmins = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), {
    ...query,
    sort: `${query.sort} isDeleted`,
  })
    .searchQuery(adminSearchableFields) // Use the Admin searchable fields
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()
    .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }])

  const result = await adminQuery?.queryModel
  const total = await Admin.countDocuments(adminQuery.queryModel.getFilter())
  return { data: result, total }
}

const getAdminById = async (id: string) => {
  const admin = await Admin.findOne({ _id: id }) // Use _id instead of id
    .select('-__v')
    .populate('user', '-createdAt -password -updatedAt -__v')
  return admin
}


const updateAdminById = async (id: string, file: any, payload: Partial<TAdmin>) => {
  const { ...restAdminData } = payload
  const modifiedUpdatedData: Record<string, unknown> = {
    ...restAdminData,
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

  const admin = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
  })
    .select('-__v')
    .populate('user', '-createdAt -password -updatedAt -__v')


  const jwtPayload = {
    userId: admin?.user?._id,
    _id: admin?._id,
    email: admin?.email,
    role: 'admin',
    name: admin?.name,
    profileImg: admin?.profileImg,
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


  return { admin, accessToken, refreshToken }
}

const deleteAdminById = async (id: string) => {
  const admin = await Admin.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return admin
}

export const adminServices = {
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
}
