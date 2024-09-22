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
exports.doctorServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const doctor_model_1 = __importDefault(require("./doctor.model"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctor = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const doctorQuery = new QueryBuilder_1.default(doctor_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} isDeleted` }))
        .searchQuery(doctor_constant_1.doctorSearchableFields)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }]);
    const result = yield (doctorQuery === null || doctorQuery === void 0 ? void 0 : doctorQuery.queryModel);
    const total = yield doctor_model_1.default.countDocuments(doctorQuery.queryModel.getFilter());
    return { data: result, total };
});
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield doctor_model_1.default.findOne({ id })
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v');
    return student;
});
// const updateDoctorById = async (id: string, payload: Partial<TDoctor>) => {
//   const { name, guardian, ...restStudentData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restStudentData,
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
//   const student = await Student.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')
//   return student
// }
const deleteDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield doctor_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return student;
});
exports.doctorServices = {
    getAllDoctor,
    getDoctorById,
    // updateDoctorById,
    deleteDoctorById,
};
