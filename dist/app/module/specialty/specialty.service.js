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
exports.specialtyService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const specialty_constant_1 = require("./specialty.constant");
const specialty_model_1 = __importDefault(require("./specialty.model"));
const createSpecialty = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new specialty entry
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            payload.icon = cloudinaryRes.secure_url;
        }
    }
    const result = yield specialty_model_1.default.create(payload);
    return result;
});
const getAllSpecialty = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const specialtyQuery = new QueryBuilder_1.default(specialty_model_1.default.find(), query)
        .searchQuery(specialty_constant_1.specialtySearchableField)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery();
    const result = yield (specialtyQuery === null || specialtyQuery === void 0 ? void 0 : specialtyQuery.queryModel);
    const total = yield specialty_model_1.default.countDocuments(specialtyQuery.queryModel.getFilter());
    return { data: result, total };
});
const getSpecialtyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const specialty = yield specialty_model_1.default.findById(id).select('-__v');
    return specialty;
});
const updateSpecialtyById = (file, id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
        if (cloudinaryRes) {
            payload.icon = cloudinaryRes.secure_url;
        }
    }
    const specialty = yield specialty_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    }).select('-__v');
    return specialty;
});
const deleteSpecialtyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const specialty = yield specialty_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return specialty;
});
exports.specialtyService = {
    createSpecialty,
    getAllSpecialty,
    getSpecialtyById,
    updateSpecialtyById,
    deleteSpecialtyById,
};
