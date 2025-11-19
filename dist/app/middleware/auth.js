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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const user_model_1 = __importDefault(require("../module/user/user.model"));
const jwtVerify_1 = __importDefault(require("../utils/jwtVerify"));
const cookie = __importStar(require("cookie"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        // Parse cookies from header
        const token = req.headers.authorization || `Bearer ${(_b = cookie.parse(((_a = req.headers) === null || _a === void 0 ? void 0 : _a.cookie) || "")) === null || _b === void 0 ? void 0 : _b.DEaccessToken}`;
        if (!token) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        const bearerToken = (_c = token.split(' ')) === null || _c === void 0 ? void 0 : _c[1];
        if (!bearerToken) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        // let decoded
        // try {
        //   decoded = jwt.verify(
        //     bearerToken,
        //     process.env.JWT_ACCESS_SECRET as string,
        //   ) as JwtPayload
        // } catch (e) {
        //   throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized!')
        // }
        // console.log(bearerToken);
        const decoded = (yield (0, jwtVerify_1.default)(bearerToken, process.env.JWT_ACCESS_SECRET));
        const { userId, role } = decoded;
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'This user is not found!');
        }
        const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
        if (isDeleted) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'This user is deleted!');
        }
        // checking if the user is not active
        const userStatus = user === null || user === void 0 ? void 0 : user.status;
        if (userStatus === 'inactive') {
            throw new appError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, 'This user is not active!');
        }
        if (requiredRoles && !requiredRoles.includes(role)) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized!');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
