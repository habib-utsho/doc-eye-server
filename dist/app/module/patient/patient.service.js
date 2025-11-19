"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientServices = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const patient_constant_1 = require("./patient.constant");
const patient_model_1 = __importDefault(require("./patient.model")); // Import Patient model
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../user/user.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getAllPatients = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const patientQuery = new QueryBuilder_1.default(patient_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} isDeleted` }))
        .searchQuery(patient_constant_1.patientSearchableFields) // Use the Patient searchable fields
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([{ path: 'user', select: '-createdAt -updatedAt -__v' }, {
            path: 'favoriteDoctors', select: '-createdAt -updatedAt -__v',
            // populate: {
            //   path: 'medicalSpecialties',
            //   select: '-createdAt -updatedAt -__v',
            // },
        }]);
    const result = yield (patientQuery === null || patientQuery === void 0 ? void 0 : patientQuery.queryModel);
    const total = yield patient_model_1.default.countDocuments(patientQuery.queryModel.getFilter());
    return { data: result, total };
});
const getPatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.default.findOne({ _id: id }) // Use _id instead of id
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -password -__v')
        .populate({
        path: 'favoriteDoctors',
        select: '-createdAt -updatedAt -__v',
        populate: {
            path: 'medicalSpecialties',
            select: '-createdAt -updatedAt -__v',
        },
    });
    return patient;
});
const makePatientAdmin = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // Find patient and linked user
        const patient = yield patient_model_1.default.findById(patientId).session(session);
        if (!patient)
            throw new Error("Patient not found");
        const user = yield user_model_1.default.findById(patient.user).session(session);
        if (!user)
            throw new Error("User not found");
        // 1️⃣ Update user role
        user.role = "admin";
        yield user.save({ session });
        const adminData = patient.toObject();
        // now create admin
        const admin = yield admin_model_1.default.create([adminData], { session });
        // 3️⃣ Optional: remove from patient collection
        yield patient_model_1.default.deleteOne({ _id: patientId }, { session });
        yield session.commitTransaction();
        return admin[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, error);
    }
    finally {
        session.endSession();
    }
});
const updateFavoriteDoctors = (patientId, doctorId) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.default.findById(patientId);
    if (!patient) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Patient not found");
    }
    // Convert incoming doctorId string to a mongoose ObjectId for safe comparison/push
    const doctorObjectId = new mongoose_1.Types.ObjectId(doctorId);
    // Check 10 favorite doctors limit
    if (!patient.favoriteDoctors.some((favDoctorId) => favDoctorId.toString() === doctorId) && patient.favoriteDoctors.length >= 10) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "You can only have up to 10 favorite doctors.");
    }
    // Check if the doctor is already in favoriteDoctors (compare by string form)
    const isFavorite = patient.favoriteDoctors.some((favDoctorId) => favDoctorId.toString() === doctorId);
    const message = isFavorite ? "Doctor removed from favorites" : "Doctor added to favorites";
    if (isFavorite) {
        // Remove doctor from favoriteDoctors
        patient.favoriteDoctors = patient.favoriteDoctors.filter((favDoctorId) => favDoctorId.toString() !== doctorId);
    }
    else {
        // Add doctor to favoriteDoctors
        patient.favoriteDoctors.push(doctorObjectId);
    }
    yield patient.save();
    return { patient, message };
});
const updatePatientById = (id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ file, payload });
    var _a;
    const { favoriteDoctors } = payload, restPatientData = __rest(payload, ["favoriteDoctors"]);
    const modifiedUpdatedData = Object.assign({}, restPatientData);
    // Non primitive handle
    // Fav doctors handled by different api, but if client side provides fav doctors when user update then verify it for safety. so it possible to update fav doctors when user updates also.
    if (favoriteDoctors) {
        if (!Array.isArray(favoriteDoctors)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Favorite doctors should be an array");
        }
        // Validate fav doctors IDs
        const validFavDoctors = yield doctor_model_1.default.find({
            _id: { $in: favoriteDoctors },
        }).select('_id');
        if ((validFavDoctors === null || validFavDoctors === void 0 ? void 0 : validFavDoctors.length) !== (favoriteDoctors === null || favoriteDoctors === void 0 ? void 0 : favoriteDoctors.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'One or more fav doctors IDs are invalid!');
        }
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Favorite doctors should be an array");
    }
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            modifiedUpdatedData.profileImg = cloudinaryRes.secure_url;
        }
    }
    const patient = yield patient_model_1.default.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
    })
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -password -__v');
    const jwtPayload = {
        userId: (_a = patient === null || patient === void 0 ? void 0 : patient.user) === null || _a === void 0 ? void 0 : _a._id,
        _id: patient === null || patient === void 0 ? void 0 : patient._id,
        email: patient === null || patient === void 0 ? void 0 : patient.email,
        role: 'patient',
        name: patient === null || patient === void 0 ? void 0 : patient.name,
        profileImg: patient === null || patient === void 0 ? void 0 : patient.profileImg,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return { patient, accessToken, refreshToken };
});
const deletePatientById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const patient = yield patient_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return patient;
});
exports.patientServices = {
    getAllPatients,
    getPatientById,
    updatePatientById,
    makePatientAdmin,
    deletePatientById,
    updateFavoriteDoctors
};
