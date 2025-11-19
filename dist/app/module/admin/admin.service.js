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
exports.adminServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const uploadImgToCloudinary_1 = require("../../utils/uploadImgToCloudinary");
const admin_constant_1 = require("./admin.constant");
const admin_model_1 = __importDefault(require("./admin.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
        .populate('user', '-createdAt -password -updatedAt -__v');
    return admin;
});
const updateAdminById = (id, file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const restAdminData = __rest(payload, []);
    const modifiedUpdatedData = Object.assign({}, restAdminData);
    // file upload
    if (file === null || file === void 0 ? void 0 : file.path) {
        const cloudinaryRes = yield (0, uploadImgToCloudinary_1.uploadImgToCloudinary)(`${payload.name}-${Date.now()}`, file.path);
        if (cloudinaryRes === null || cloudinaryRes === void 0 ? void 0 : cloudinaryRes.secure_url) {
            modifiedUpdatedData.profileImg = cloudinaryRes.secure_url;
        }
    }
    const admin = yield admin_model_1.default.findByIdAndUpdate(id, modifiedUpdatedData, {
        new: true,
    })
        .select('-__v')
        .populate('user', '-createdAt -password -updatedAt -__v');
    const jwtPayload = {
        userId: (_a = admin === null || admin === void 0 ? void 0 : admin.user) === null || _a === void 0 ? void 0 : _a._id,
        _id: admin === null || admin === void 0 ? void 0 : admin._id,
        email: admin === null || admin === void 0 ? void 0 : admin.email,
        role: 'admin',
        name: admin === null || admin === void 0 ? void 0 : admin.name,
        profileImg: admin === null || admin === void 0 ? void 0 : admin.profileImg,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return { admin, accessToken, refreshToken };
});
const deleteAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.default.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).select('-__v');
    return admin;
});
exports.adminServices = {
    getAllAdmins,
    getAdminById,
    updateAdminById,
    deleteAdminById,
};
