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
exports.userServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("./user.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const specialty_model_1 = __importDefault(require("../specialty/specialty.model"));
const insertPatient = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const alreadyExistEmail = yield patient_model_1.default.findOne({ email: payload.email });
        if (alreadyExistEmail) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already exist. Try with different email!');
        }
        const alreadyExistPhone = yield patient_model_1.default.findOne({ phone: payload.phone });
        if (alreadyExistPhone) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Phone is already exist. Try with different phone!');
        }
        // file upload
        if (file === null || file === void 0 ? void 0 : file.path) {
            const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
            if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
                payload.profileImg = cloudinaryRes.secure_url;
            }
        }
        const userData = {
            email: payload.email,
            password: payload.password,
            needsPasswordChange: false,
            role: 'patient',
        };
        // Save user
        const user = yield user_model_1.default.create([userData], { session });
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert user to db');
        }
        const patientData = Object.assign(Object.assign({}, payload), { user: user[0]._id });
        // Save patient
        const patient = yield patient_model_1.default.create([patientData], { session });
        if (!(patient === null || patient === void 0 ? void 0 : patient.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert patient!');
        }
        yield session.commitTransaction();
        yield session.endSession();
        return patient[0];
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const insertDoctor = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { medicalSpecialties } = payload;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const alreadyExistEmail = yield doctor_model_1.default.findOne({ email: payload.email });
        const alreadyExistNid = yield doctor_model_1.default.findOne({ nid: payload.nid });
        const alreadyExistPhone = yield doctor_model_1.default.findOne({ phone: payload.phone });
        const alreadyExistBmdc = yield doctor_model_1.default.findOne({ phone: payload.bmdc });
        if (alreadyExistEmail) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already exist. Try with different email!');
        }
        if (alreadyExistNid) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'NID is already exist. Try with different NID!');
        }
        if (alreadyExistPhone) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Phone is already exist. Try with different phone!');
        }
        if (alreadyExistBmdc) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'BMDC is already exist. Try with different BMDC!');
        }
        // Validate medicalSpecialties IDs
        const validSpecialties = yield specialty_model_1.default.find({
            _id: { $in: payload.medicalSpecialties },
        }).select('_id');
        if ((validSpecialties === null || validSpecialties === void 0 ? void 0 : validSpecialties.length) !== (medicalSpecialties === null || medicalSpecialties === void 0 ? void 0 : medicalSpecialties.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'One or more medical specialty IDs are invalid!');
        }
        // file upload
        if (file === null || file === void 0 ? void 0 : file.path) {
            const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
            if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
                payload.profileImg = cloudinaryRes.secure_url;
            }
        }
        const totalDoctor = yield doctor_model_1.default.countDocuments({}).exec();
        // Update id
        const slNo = totalDoctor > 0 ? totalDoctor + 1 : 1;
        const doctorCode = `DE-${slNo.toString().padStart(4, '0')}`;
        const userData = {
            email: payload.email,
            password: payload.password || process.env.DOCTOR_DEFAULT_PASSWORD,
            needsPasswordChange: payload.password ? false : true,
            role: 'doctor',
        };
        // Save user
        const user = yield user_model_1.default.create([userData], { session });
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert user!');
        }
        const doctorData = Object.assign(Object.assign({}, payload), { doctorCode, user: user[0]._id });
        // Save doctor
        const doctor = yield doctor_model_1.default.create([doctorData], { session });
        if (!(doctor === null || doctor === void 0 ? void 0 : doctor.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert doctor!');
        }
        yield session.commitTransaction();
        return doctor[0];
    }
    catch (err) {
        yield session.abortTransaction();
        throw new Error(err);
    }
    finally {
        yield session.endSession();
    }
});
const insertAdmin = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const alreadyExistEmail = yield admin_model_1.default.findOne({ email: payload.email });
        const alreadyExistNid = yield admin_model_1.default.findOne({ nid: payload.nid });
        const alreadyExistPhone = yield admin_model_1.default.findOne({ phone: payload.phone });
        if (alreadyExistEmail) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Email is already exist. Try with different email!');
        }
        if (alreadyExistNid) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'NID is already exist. Try with different NID!');
        }
        if (alreadyExistPhone) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Phone is already exist. Try with different phone!');
        }
        // file upload
        if (file === null || file === void 0 ? void 0 : file.path) {
            const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
            if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
                payload.profileImg = cloudinaryRes.secure_url;
            }
        }
        const userData = {
            email: payload.email,
            password: payload.password || process.env.ADMIN_DEFAULT_PASSWORD,
            needsPasswordChange: payload.password ? false : true,
            role: 'admin',
        };
        // Save user
        const user = yield user_model_1.default.create([userData], { session });
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert user!');
        }
        const adminData = Object.assign(Object.assign({}, payload), { user: user[0]._id });
        // Save doctor
        const admin = yield admin_model_1.default.create([adminData], { session });
        if (!(admin === null || admin === void 0 ? void 0 : admin.length)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Failed to insert admin!');
        }
        yield session.commitTransaction();
        return admin[0];
    }
    catch (err) {
        yield session.abortTransaction();
        throw new Error(err);
    }
    finally {
        yield session.endSession();
    }
});
// const insertAdminToDb = async (payload: TAdmin & TUser) => {
//   const session = await mongoose.startSession()
//   try {
//     session.startTransaction()
//     const alreadyExistEmail = await Faculty.findOne({ email: payload.email })
//     const alreadyExistNid = await Faculty.findOne({ nid: payload.nid })
//     const alreadyExistPhone = await Faculty.findOne({ phone: payload.phone })
//     if (alreadyExistEmail) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Email is already exist. Try with different email!',
//       )
//     }
//     if (alreadyExistNid) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'NID is already exist. Try with different NID!',
//       )
//     }
//     if (alreadyExistPhone) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Phone is already exist. Try with different phone!',
//       )
//     }
//     const totalAdmin = await Admin.countDocuments({}).exec()
//     // Update id
//     const slNo = totalAdmin > 0 ? totalAdmin + 1 : 1
//     const id = `A-${slNo.toString().padStart(4, '0')}`
//     const userData: Partial<TUser> = {
//       id,
//       email: payload.email,
//       password: payload.password || process.env.ADMIN_DEFAULT_PASSWORD,
//       role: 'admin',
//     }
//     // Save user
//     const user = await User.create([userData], { session })
//     if (!user?.length) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to insert user to db')
//     }
//     const adminData: Partial<TAdmin> = {
//       ...payload,
//       id,
//       user: user[0]._id,
//     }
//     // Save admin
//     const admin = await Admin.create([adminData], { session })
//     if (!admin?.length) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Failed to insert admin to db',
//       )
//     }
//     await session.commitTransaction()
//     return admin[0]
//   } catch (err: any) {
//     await session.abortTransaction()
//     throw new Error(err)
//   } finally {
//     await session.endSession()
//   }
// }
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({}).select('-__v');
    return users;
});
const getSingleUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id).select('-__v');
    return user;
});
const toggleUserStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id).select('-__v');
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    // Toggle user status
    user.status = user.status === 'active' ? 'inactive' : 'active';
    yield user.save();
    return user;
});
const getMe = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    if (payload.role === 'doctor') {
        result = yield doctor_model_1.default.findOne({ id: payload.id }).select('-__v');
    }
    if (payload.role === 'patient') {
        result = yield patient_model_1.default.findOne({ id: payload.id }).select('-__v');
    }
    // if (payload.role === 'admin') {
    //   result = await Admin.findOne({ id: payload.id }).select('-__v')
    // }
    return result;
});
exports.userServices = {
    insertPatient,
    insertDoctor,
    insertAdmin,
    // insertAdminToDb,
    getAllUser,
    getSingleUserById,
    toggleUserStatus,
    getMe,
};
