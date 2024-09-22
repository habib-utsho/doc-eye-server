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
exports.patientServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const patient_constant_1 = require("./patient.constant");
const patient_model_1 = __importDefault(require("./patient.model")); // Import Patient model
const getAllPatients = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const patientQuery = new QueryBuilder_1.default(patient_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} isDeleted` }))
        .searchQuery(patient_constant_1.patientSearchableFields) // Use the Patient searchable fields
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }]);
    const result = yield (patientQuery === null || patientQuery === void 0 ? void 0 : patientQuery.queryModel);
    const total = yield patient_model_1.default.countDocuments(patientQuery.queryModel.getFilter());
    return { data: result, total };
});
const getPatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.default.findOne({ _id: id }) // Use _id instead of id
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v');
    return patient;
});
// const updatePatientById = async (id: string, payload: Partial<TPatient>) => {
//   const { name, guardian, ...restPatientData } = payload
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...restPatientData,
//   }
//   // update non-primitive values
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
//   const patient = await Patient.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//   })
//     .select('-__v')
//     .populate('user', '-createdAt -updatedAt -__v -department')
//     .populate('academicInfo.department')
//     .populate('academicInfo.batch')
//   return patient
// }
const deletePatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return patient;
});
exports.patientServices = {
    // Change export name to patientServices
    getAllPatients, // Change to getAllPatients
    getPatientById, // Change to getPatientById
    // updatePatientById, // Change to updatePatientById
    deletePatientById, // Change to deletePatientById
};
