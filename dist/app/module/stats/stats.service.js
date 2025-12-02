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
exports.statsService = void 0;
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const appointment_model_1 = __importDefault(require("../appointment/appointment.model"));
const payment_model_1 = __importDefault(require("../payment/payment.model"));
const mongoose_1 = require("mongoose");
const review_model_1 = __importDefault(require("../review/review.model"));
const appError_1 = __importDefault(require("../../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const getPatientStats = (pPatient) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const patient = yield patient_model_1.default.findById(pPatient === null || pPatient === void 0 ? void 0 : pPatient._id);
    if (!patient)
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Patient not found");
    // Appointment stats
    const totalAppointments = yield appointment_model_1.default.find({ patient: patient === null || patient === void 0 ? void 0 : patient._id }).countDocuments();
    const totalPendingAppointments = yield appointment_model_1.default.find({ patient: patient === null || patient === void 0 ? void 0 : patient._id, status: "pending" }).countDocuments();
    const totalConfirmedAppointments = yield appointment_model_1.default.find({ patient: patient === null || patient === void 0 ? void 0 : patient._id, status: "confirmed" }).countDocuments();
    const totalCompletedAppointments = yield appointment_model_1.default.find({ patient: patient === null || patient === void 0 ? void 0 : patient._id, status: "completed" }).countDocuments();
    const totalCanceledAppointments = yield appointment_model_1.default.find({ patient: patient === null || patient === void 0 ? void 0 : patient._id, status: "canceled" }).countDocuments();
    const mostConsultedDoctor = yield appointment_model_1.default.aggregate([
        {
            $match: { patient: new mongoose_1.Types.ObjectId(patient === null || patient === void 0 ? void 0 : patient._id) },
        },
        {
            $group: { _id: "$doctor", count: { $sum: 1 } },
        },
        {
            $sort: { count: -1 },
        },
        {
            $limit: 1,
        },
        {
            $lookup: {
                from: "doctors",
                localField: "_id",
                foreignField: "_id",
                as: "doctorDetails",
            },
        },
        { $unwind: "$doctorDetails" },
        // 🩺 populate doctor.medicalSpecialties
        {
            $lookup: {
                from: "specialties", // collection name (check your MongoDB naming)
                localField: "doctorDetails.medicalSpecialties",
                foreignField: "_id",
                as: "doctorDetails.medicalSpecialties",
            },
        },
        {
            $project: {
                _id: 0,
                doctorId: "$doctorDetails._id",
                doctorTitle: "$doctorDetails.doctorTitle",
                name: "$doctorDetails.name",
                profileImg: "$doctorDetails.profileImg",
                doctorCode: "$doctorDetails.doctorCode",
                workingExperiences: "$doctorDetails.workingExperiences",
                currentWorkplace: "$doctorDetails.currentWorkplace",
                availability: "$doctorDetails.availability",
                patientAttended: "$doctorDetails.patientAttended",
                doctorType: "$doctorDetails.doctorType",
                medicalDegree: "$doctorDetails.medicalDegree",
                totalExperienceYears: "$doctorDetails.totalExperienceYears",
                medicalSpecialties: "$doctorDetails.medicalSpecialties", // now populated!
                consultationCount: "$count",
            },
        },
    ]);
    // Payment stats (only confirmed)
    const paymentsAgg = yield payment_model_1.default.aggregate([
        {
            $match: {
                patient: new mongoose_1.Types.ObjectId(patient === null || patient === void 0 ? void 0 : patient._id),
                status: "confirmed",
            },
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount.total" },
                totalPayments: { $sum: 1 },
            },
        },
    ]);
    const totalAmount = ((_a = paymentsAgg[0]) === null || _a === void 0 ? void 0 : _a.totalAmount) || 0;
    const totalPayments = ((_b = paymentsAgg[0]) === null || _b === void 0 ? void 0 : _b.totalPayments) || 0;
    // Review stats
    const totalReviews = yield review_model_1.default.find({ patient: patient === null || patient === void 0 ? void 0 : patient._id }).countDocuments();
    // Optional: distinct doctors consulted
    const distinctDoctors = yield appointment_model_1.default.distinct("doctor", { patient: patient === null || patient === void 0 ? void 0 : patient._id });
    return {
        patient,
        totalAppointments,
        totalPendingAppointments,
        totalConfirmedAppointments,
        totalCompletedAppointments,
        totalCanceledAppointments,
        totalPayments,
        totalAmount,
        totalReviews,
        totalDoctorsConsulted: distinctDoctors.length,
        mostConsultedDoctor: mostConsultedDoctor[0] || null,
    };
});
const getDoctorStats = (pDoctor) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const doctor = yield doctor_model_1.default.findById(pDoctor === null || pDoctor === void 0 ? void 0 : pDoctor._id);
    if (!doctor)
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Doctor not found");
    const totalAppointments = yield appointment_model_1.default.find({ doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id }).countDocuments();
    const totalPendingAppointments = yield appointment_model_1.default.find({ status: "pending", doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id }).countDocuments();
    const totalConfirmedAppointments = yield appointment_model_1.default.find({ status: "confirmed", doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id }).countDocuments();
    const totalCompletedAppointments = yield appointment_model_1.default.find({ status: "completed", doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id }).countDocuments();
    const totalCanceledAppointments = yield appointment_model_1.default.find({ status: "canceled", doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id }).countDocuments();
    // Review stats
    const highlySatisfiedPatients = yield review_model_1.default.find({
        doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id,
        rating: { $gte: 4 },
    }).countDocuments();
    const moderatelySatisfiedPatients = yield review_model_1.default.find({
        doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id,
        rating: 3,
    }).countDocuments();
    const dissatisfiedPatients = yield review_model_1.default.find({
        doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id,
        rating: { $lte: 2 },
    }).countDocuments();
    const totalReviews = yield review_model_1.default.find({ doctor: doctor === null || doctor === void 0 ? void 0 : doctor._id }).countDocuments();
    const averageRating = totalReviews > 0 ? (_b = (_a = (yield review_model_1.default.aggregate([
        { $match: { doctor: new mongoose_1.Types.ObjectId(pDoctor._id) } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]))[0]) === null || _a === void 0 ? void 0 : _a.avgRating) === null || _b === void 0 ? void 0 : _b.toFixed(2) : 0;
    // Payment stats
    const paymentsAgg = yield payment_model_1.default.aggregate([
        {
            $match: {
                doctor: new mongoose_1.Types.ObjectId(pDoctor._id),
                status: "confirmed"
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount.total" },
                totalPayments: { $sum: 1 }
            }
        }
    ]);
    const totalAmount = ((_c = paymentsAgg[0]) === null || _c === void 0 ? void 0 : _c.totalAmount) || 0;
    const totalPayments = ((_d = paymentsAgg[0]) === null || _d === void 0 ? void 0 : _d.totalPayments) || 0;
    return { doctor, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating };
});
const getAdminStats = (pAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const admin = yield admin_model_1.default.findById(pAdmin === null || pAdmin === void 0 ? void 0 : pAdmin._id);
    if (!admin)
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Admin not found");
    const totalAppointments = yield appointment_model_1.default.find().countDocuments();
    const totalPendingAppointments = yield appointment_model_1.default.find({ status: "pending" }).countDocuments();
    const totalConfirmedAppointments = yield appointment_model_1.default.find({ status: "confirmed" }).countDocuments();
    const totalCompletedAppointments = yield appointment_model_1.default.find({ status: "completed" }).countDocuments();
    const totalCanceledAppointments = yield appointment_model_1.default.find({ status: "canceled" }).countDocuments();
    const totalPatients = yield patient_model_1.default.find().countDocuments();
    const totalDoctors = yield doctor_model_1.default.find().countDocuments();
    // Review stats
    const highlySatisfiedPatients = yield review_model_1.default.find({
        rating: { $gte: 4 },
    }).countDocuments();
    const moderatelySatisfiedPatients = yield review_model_1.default.find({
        rating: 3,
    }).countDocuments();
    const dissatisfiedPatients = yield review_model_1.default.find({
        rating: { $lte: 2 },
    }).countDocuments();
    const totalReviews = yield review_model_1.default.find().countDocuments();
    const averageRating = totalReviews > 0 ? (_b = (_a = (yield review_model_1.default.aggregate([
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]))[0]) === null || _a === void 0 ? void 0 : _a.avgRating) === null || _b === void 0 ? void 0 : _b.toFixed(2) : 0;
    // Payment stats
    const paymentsAgg = yield payment_model_1.default.aggregate([
        {
            $match: {
                status: "confirmed"
            }
        },
        {
            $group: {
                _id: null,
                totalAmount: { $sum: "$amount.total" },
                totalPayments: { $sum: 1 }
            }
        }
    ]);
    const totalAmount = ((_c = paymentsAgg[0]) === null || _c === void 0 ? void 0 : _c.totalAmount) || 0;
    const totalPayments = ((_d = paymentsAgg[0]) === null || _d === void 0 ? void 0 : _d.totalPayments) || 0;
    return { admin, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating, totalPatients, totalDoctors };
});
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const getEarningsStats = (pUser, yearParam) => __awaiter(void 0, void 0, void 0, function* () {
    const { role, _id } = pUser || {};
    let user;
    if (role === "admin") {
        user = yield admin_model_1.default.findById(_id);
    }
    else if (role === 'doctor') {
        user = yield doctor_model_1.default.findById(_id);
    }
    else if (role === 'patient') {
        user = yield patient_model_1.default.findById(_id);
    }
    if (!user) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to access this route');
    }
    // Determine year and month range
    const now = new Date();
    const year = yearParam !== null && yearParam !== void 0 ? yearParam : now.getFullYear();
    const isCurrentYear = year === now.getFullYear();
    const lastMonth = isCurrentYear ? now.getMonth() + 1 : 12; // 1..n inclusive
    // Range for the selected year
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    // Build match condition
    const match = {
        status: "confirmed",
        createdAt: { $gte: start, $lt: end },
    };
    if (role === "doctor") {
        match["doctor"] = user._id;
    }
    else if (role === "patient") {
        match["patient"] = user._id;
    }
    // Aggregate confirmed payments by month for given year
    const monthlyAgg = yield payment_model_1.default.aggregate([
        {
            $match: match
        },
        {
            $group: {
                _id: { month: { $month: "$createdAt" } },
                totalAmount: { $sum: "$amount.total" },
                totalPayments: { $sum: 1 },
            },
        },
    ]);
    // Map results by month number
    const byMonth = {};
    for (const m of monthlyAgg) {
        byMonth[m._id.month] = {
            totalAmount: m.totalAmount || 0,
            totalPayments: m.totalPayments || 0,
        };
    }
    // Build series from Jan to lastMonth (current year) or 12 (other years)
    const months = Array.from({ length: lastMonth }, (_, i) => {
        var _a;
        const monthNum = i + 1; // 1..lastMonth
        const data = (_a = byMonth[monthNum]) !== null && _a !== void 0 ? _a : { totalAmount: 0, totalPayments: 0 };
        return {
            monthIndex: monthNum, // 1-12
            month: monthNames[i], // "January", ...
            totalAmount: data.totalAmount,
            totalPayments: data.totalPayments,
        };
    });
    const totals = months.reduce((acc, m) => {
        acc.totalAmount += m.totalAmount;
        acc.totalPayments += m.totalPayments;
        return acc;
    }, { totalAmount: 0, totalPayments: 0 });
    return {
        // user,
        year,
        months, // month-wise series (Jan..current or full 12)
        totalAmount: totals.totalAmount,
        totalPayments: totals.totalPayments,
    };
});
exports.statsService = {
    getPatientStats,
    getDoctorStats,
    getAdminStats,
    getEarningsStats
};
