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
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const user_model_1 = __importDefault(require("../user/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User not found!');
    }
    if ((user === null || user === void 0 ? void 0 : user.status) === 'inactive') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is not active!');
    }
    const isDoctor = (user === null || user === void 0 ? void 0 : user.role) === 'doctor';
    if (isDoctor) {
        const doctor = (yield doctor_model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id }));
        const doctorStatus = doctor === null || doctor === void 0 ? void 0 : doctor.status;
        if (doctorStatus !== 'approve') {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, doctorStatus === 'pending'
                ? `Dear ${doctor.doctorTitle} ${doctor.name}, wait for admin approval. You will be notified via email!'`
                : 'Your account is rejected by admin!');
        }
    }
    const decryptPass = yield bcrypt_1.default.compare(payload.password, user.password);
    if (!decryptPass) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Incorrect password!');
    }
    const jwtPayload = { _id: user === null || user === void 0 ? void 0 : user._id, email: user.email, role: user.role };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return {
        accessToken,
        refreshToken,
        data: user,
        needsPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
    }
    catch (e) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
    }
    const { email } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is deleted !');
    }
    if (user.status === 'inactive') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is not active!');
    }
    if (user.isDeleted) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is deleted!');
    }
    const jwtPayload = { _id: user === null || user === void 0 ? void 0 : user._id, email: user.email, role: user.role };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    return {
        accessToken,
    };
});
const forgetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    const jwtPayload = { _id: user === null || user === void 0 ? void 0 : user._id, email: user.email, role: user.role };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '10m',
    });
    const resetLink = `${process.env.CLIENT_URL}/reset-password?email=${user.email}&token=${accessToken}`;
    yield (0, sendEmail_1.sendEmail)({
        toEmail: user.email,
        subject: 'Reset your password for Doc Eye!',
        text: `You requested a password reset for your account. Please click the link below to reset your password:
    ${resetLink} This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.`,
        html: `
    <p>You requested a password reset for your account.</p>

    <p>Please click the link below to reset your password:</p>

 <div>
    <a href="${resetLink}" style="background-color: #05668D; margin: 5px 0; cursor: pointer; padding: 10px 20px; border-radius: 5px; color: white; font-weight: bold; text-decoration: none; display: inline-block;">Reset Password</a>
  </div>

    <p>This link will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
    `,
    });
    return { resetLink };
});
const resetPassword = (payload, jwtPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: payload.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    if (jwtPayload.email != user.email) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'You are not authorized to reset password for this user');
    }
    const hashedPass = yield bcrypt_1.default.hash(payload.newPassword, Number(process.env.SALT_ROUNDS));
    const result = yield user_model_1.default.findOneAndUpdate({ email: payload.email }, { password: hashedPass, needsPasswordChange: false }, { new: true }).select('-password');
    if (!result) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update password.');
    }
    return result;
});
const changePassword = (userPayload, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email: userPayload.email });
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found!');
    }
    const decryptPass = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    if (!decryptPass) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'Password is not match');
    }
    const hashedPass = yield bcrypt_1.default.hash(payload.newPassword, Number(process.env.SALT_ROUNDS));
    const result = yield user_model_1.default.findOneAndUpdate({ email: userPayload.email }, { password: hashedPass, needsPasswordChange: false }, { new: true }).select('-password');
    if (!result) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update password.');
    }
    return result;
});
exports.authServices = {
    login,
    refreshToken,
    forgetPassword,
    resetPassword,
    changePassword,
};
