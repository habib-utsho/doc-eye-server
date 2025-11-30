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
exports.doctorServices = void 0;
/* eslint-disable prefer-const */
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const doctor_model_1 = __importDefault(require("./doctor.model"));
const doctor_constant_1 = require("./doctor.constant");
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const moment_1 = __importDefault(require("moment"));
const specialty_model_1 = __importDefault(require("../specialty/specialty.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const getAllDoctor = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const availabilityQuery = query.availability;
    delete query.availability;
    const doctorQuery = new QueryBuilder_1.default(doctor_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} isDeleted` }))
        .searchQuery(doctor_constant_1.doctorSearchableFields)
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'user', select: '-createdAt -updatedAt -__v' },
        { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ]);
    let result = yield (doctorQuery === null || doctorQuery === void 0 ? void 0 : doctorQuery.queryModel);
    // Apply custom filtering based on availability
    if (availabilityQuery == "online_now" || availabilityQuery == " available_today" || availabilityQuery == "available_in_next_three_days" || availabilityQuery == "available_in_next_seven_days") {
        const now = (0, moment_1.default)();
        const todayDay = now.format('dddd');
        const currentTime = now.format('HH:mm');
        result = result.filter((doc) => {
            const { availability } = doc;
            if (!availability)
                return false;
            const { dayStart, dayEnd, timeStart, timeEnd } = availability;
            const daysOfWeek = [
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ];
            const getDayIndex = (day) => daysOfWeek.indexOf(day);
            const dayStartIndex = getDayIndex(dayStart);
            const dayEndIndex = getDayIndex(dayEnd);
            const todayIndex = getDayIndex(todayDay);
            const isWithinDayRange = (dayIndex) => {
                if (dayStartIndex <= dayEndIndex) {
                    return dayIndex >= dayStartIndex && dayIndex <= dayEndIndex;
                }
                else {
                    // Week wraps around
                    return dayIndex >= dayStartIndex || dayIndex <= dayEndIndex;
                }
            };
            // Online now: doctor is available today AND current time is within the time window
            if (availabilityQuery == "online_now") {
                if (!isWithinDayRange(todayIndex))
                    return false;
                return currentTime >= timeStart && currentTime <= timeEnd;
            }
            // Available today
            if (availabilityQuery == "available_today") {
                return isWithinDayRange(todayIndex);
            }
            // Available in next N days
            if (availabilityQuery == "available_in_next_three_days" || availabilityQuery == "available_in_next_seven_days") {
                const range = availabilityQuery == "available_in_next_three_days" ? 3 : 7;
                for (let i = 0; i < range; i++) {
                    const futureDay = now.add(i, 'day').format('dddd');
                    const futureDayIndex = getDayIndex(futureDay);
                    if (isWithinDayRange(futureDayIndex))
                        return true;
                }
                return false;
            }
            return true;
        });
    }
    // const total = await Doctor.countDocuments(doctorQuery.queryModel.getFilter())
    return { data: result, total: result.length };
});
const getDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const customDoctorId = id.startsWith("DE-");
    const doctor = yield (customDoctorId ? doctor_model_1.default.find({ doctorCode: id }) : doctor_model_1.default.findById(id))
        .select('-__v')
        .populate([
        { path: 'user', select: '-createdAt -updatedAt -password -__v' },
        { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ]);
    return doctor;
});
const getDoctorByDoctorCode = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const doctor = yield doctor_model_1.default.findOne({ doctorCode: id })
        .select('-__v')
        .populate([
        { path: 'user', select: '-createdAt -updatedAt -password -__v' },
        { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ]);
    if (!doctor) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Doctor not found!');
    }
    return doctor;
});
// TODO: need to handle workingExperiences and medicalSpecialties for update doctor
const updateDoctorById = (id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let { availability, currentWorkplace, workingExperiences, medicalSpecialties } = payload, restDoctorData = __rest(payload, ["availability", "currentWorkplace", "workingExperiences", "medicalSpecialties"]);
    const modifiedUpdatedData = Object.assign({}, restDoctorData);
    let existDoctor = yield doctor_model_1.default.findById(id);
    if (!existDoctor) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Doctor not found!');
    }
    // console.log(payload);
    // update non primitive values
    // Update availability
    if (availability && ((_a = Object.keys(availability)) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        for (const [key, value] of Object.entries(availability)) {
            modifiedUpdatedData[`availability.${key}`] = value;
        }
    }
    // Update currentWorkplace
    if (currentWorkplace && ((_b = Object.keys(currentWorkplace)) === null || _b === void 0 ? void 0 : _b.length) > 0) {
        for (const [key, value] of Object.entries(currentWorkplace)) {
            modifiedUpdatedData[`currentWorkplace.${key}`] = value;
        }
    }
    // Update/replace entire workingExperiences
    if (Array.isArray(workingExperiences)) {
        modifiedUpdatedData.workingExperiences = workingExperiences;
    }
    // console.log(modifiedUpdatedData);
    if (payload.followupFee && payload.consultationFee && ((payload === null || payload === void 0 ? void 0 : payload.followupFee) > (payload === null || payload === void 0 ? void 0 : payload.consultationFee))) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Follow up fee should be less than or equal to consultation fee");
    }
    // Validate medicalSpecialties IDs
    let validSpecialties;
    if (!payload.medicalSpecialties || (medicalSpecialties === null || medicalSpecialties === void 0 ? void 0 : medicalSpecialties.length) === 0) {
        validSpecialties = [];
        medicalSpecialties = [];
    }
    else {
        validSpecialties = yield specialty_model_1.default.find({
            _id: { $in: payload.medicalSpecialties },
        }).select('_id');
    }
    if ((validSpecialties === null || validSpecialties === void 0 ? void 0 : validSpecialties.length) !== (medicalSpecialties === null || medicalSpecialties === void 0 ? void 0 : medicalSpecialties.length)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'One or more medical specialty IDs are invalid!');
    }
    modifiedUpdatedData.medicalSpecialties = medicalSpecialties;
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            modifiedUpdatedData.profileImg = cloudinaryRes.secure_url;
        }
    }
    if (payload.status && payload.status === 'approve') {
        yield (0, sendEmail_1.sendEmail)({
            toEmail: existDoctor.email,
            subject: 'Doctor Account Approved',
            text: `Dear ${existDoctor.doctorTitle} ${existDoctor.name},\n\nCongratulations! Your doctor account has been approved by the admin. You can now log in and start using our services.\n\nBest regards,\nDocEye Team`,
            html: `<p>Dear ${existDoctor.doctorTitle} ${existDoctor.name},</p><p>Congratulations! Your doctor account has been approved by the admin. You can now log in and start using our services.</p><p>Best regards,<br/>DocEye Team</p>`,
        });
    }
    const doctor = yield doctor_model_1.default.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
    })
        .select('-__v')
        .populate('user', '-createdAt -updatedAt -__v')
        .populate('medicalSpecialties');
    const jwtPayload = {
        userId: (doctor === null || doctor === void 0 ? void 0 : doctor.user)._id,
        _id: doctor === null || doctor === void 0 ? void 0 : doctor._id,
        email: doctor === null || doctor === void 0 ? void 0 : doctor.email,
        role: 'doctor',
        name: doctor === null || doctor === void 0 ? void 0 : doctor.name,
        profileImg: doctor === null || doctor === void 0 ? void 0 : doctor.profileImg,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return { doctor, accessToken, refreshToken };
});
const deleteDoctorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield doctor_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return student;
});
exports.doctorServices = {
    getAllDoctor,
    getDoctorById,
    getDoctorByDoctorCode,
    updateDoctorById,
    deleteDoctorById,
};
