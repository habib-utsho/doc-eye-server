"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const admin_constant_1 = require("./admin.constant");
const admin_model_1 = __importDefault(require("./admin.model")); // Import Admin model
const getAllAdmins = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const adminQuery = new QueryBuilder_1.default(admin_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} isDeleted` }))
        .searchQuery(admin_constant_1.adminSearchableFields) // Use the Admin searchable fields
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }]);
    const result = yield (adminQuery === null || adminQuery === void 0 ? void 0 : adminQuery.queryModel);
    const total = yield admin_model_1.default.countDocuments(adminQuery.queryModel.getFilter());
    return { data: result, total };
});
const getAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.default.findOne({ _id: id }) // Use _id instead of id
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v');
    return admin;
});
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
const deleteAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return admin;
});
exports.adminServices = {
    getAllAdmins,
    getAdminById,
    // updateAdminById,
    deleteAdminById,
};
