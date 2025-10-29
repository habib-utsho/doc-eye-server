
import QueryBuilder from '../../builder/QueryBuilder'
import { adminSearchableFields } from './admin.constant'
import Admin from './admin.model' 

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
    .populate('user', '-createdAt -updatedAt -__v')
  return admin
}


// const updateAdminById = async (id: string, payload: Partial<TAdmin>) => {
//   const { name, guardian, ...restAdminData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restAdminData,
//   }

//   // update non primitive values
//   // Update name
//   if (name && Object.keys(name)?.length > 0) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value
//     }
//   }
//   // update guardian
//   if (guardian && Object.keys(guardian)?.length > 0) {
//     for (const [key, value] of Object.entries(guardian)) {
//       modifiedUpdatedData[`guardian.${key}`] = value
//     }
//   }

//   const admin = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')

//   return admin
// }

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
  // updateAdminById,
  deleteAdminById,
}
