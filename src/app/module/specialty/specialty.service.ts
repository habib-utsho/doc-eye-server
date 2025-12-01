import QueryBuilder from '../../builder/QueryBuilder'
import { uploadImgToCloudinary } from '../../utils/uploadImgToCloudinary'
import { specialtySearchableField } from './specialty.constant'
import { TSpecialty } from './specialty.interface'
import Specialty from './specialty.model'

const createSpecialty = async (file: any, payload: TSpecialty) => {
  // Create a new specialty entry
  // file upload
  if (file?.path) {
    const cloudinaryRes = await uploadImgToCloudinary(
      `${payload.name}-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes?.secure_url) {
      payload.icon = cloudinaryRes.secure_url
    }
  }
  const result = await Specialty.create(payload)

  return result
}
const getAllSpecialty = async (query: Record<string, unknown>) => {
  const specialtyQuery = new QueryBuilder(Specialty.find(), query)
    .searchQuery(specialtySearchableField)
    .filterQuery()
    .sortQuery()
    .paginateQuery()
    .fieldFilteringQuery()

  const result = await specialtyQuery?.queryModel
  const total = await Specialty.countDocuments(
    specialtyQuery.queryModel.getFilter(),
  )
  return { data: result, total }
}

const getSpecialtyById = async (id: string) => {
  const specialty = await Specialty.findById(id).select('-__v')
  return specialty
}

const updateSpecialtyById = async (
  file: any,
  id: string,
  payload: Partial<TSpecialty>,
) => {
  // file upload
  if (file?.path) {
    const cloudinaryRes = await uploadImgToCloudinary(
      `${payload.name}-${Date.now()}`,
      file.path,
    )
    if (cloudinaryRes) {
      payload.icon = cloudinaryRes.secure_url
    }
  }
  const specialty = await Specialty.findByIdAndUpdate(id, payload, {
    new: true,
  }).select('-__v')

  return specialty
}
const deleteSpecialtyById = async (id: string) => {
  const specialty = await Specialty.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).select('-__v')
  return specialty
}

export const specialtyService = {
  createSpecialty,
  getAllSpecialty,
  getSpecialtyById,
  updateSpecialtyById,
  deleteSpecialtyById,
}
