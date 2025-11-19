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
const getPatientStats = (pPatient) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const patient = yield patient_model_1.default.findById(pPatient === null || pPatient === void 0 ? void 0 : pPatient._id);
    if (!patient)
        throw new Error("Patient not found");
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
    var _c, _d, _e, _f;
    const doctor = yield doctor_model_1.default.findById(pDoctor === null || pDoctor === void 0 ? void 0 : pDoctor._id);
    if (!doctor)
        throw new Error("Doctor not found");
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
    const averageRating = totalReviews > 0 ? (_d = (_c = (yield review_model_1.default.aggregate([
        { $match: { doctor: new mongoose_1.Types.ObjectId(pDoctor._id) } },
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]))[0]) === null || _c === void 0 ? void 0 : _c.avgRating) === null || _d === void 0 ? void 0 : _d.toFixed(2) : 0;
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
    const totalAmount = ((_e = paymentsAgg[0]) === null || _e === void 0 ? void 0 : _e.totalAmount) || 0;
    const totalPayments = ((_f = paymentsAgg[0]) === null || _f === void 0 ? void 0 : _f.totalPayments) || 0;
    return { doctor, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating };
});
const getAdminStats = (pAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k;
    const admin = yield admin_model_1.default.findById(pAdmin === null || pAdmin === void 0 ? void 0 : pAdmin._id);
    if (!admin)
        throw new Error("Admin not found");
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
    const averageRating = totalReviews > 0 ? (_h = (_g = (yield review_model_1.default.aggregate([
        { $group: { _id: null, avgRating: { $avg: "$rating" } } }
    ]))[0]) === null || _g === void 0 ? void 0 : _g.avgRating) === null || _h === void 0 ? void 0 : _h.toFixed(2) : 0;
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
    const totalAmount = ((_j = paymentsAgg[0]) === null || _j === void 0 ? void 0 : _j.totalAmount) || 0;
    const totalPayments = ((_k = paymentsAgg[0]) === null || _k === void 0 ? void 0 : _k.totalPayments) || 0;
    return { admin, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating, totalPatients, totalDoctors };
});
exports.statsService = {
    getPatientStats,
    getDoctorStats,
    getAdminStats
};
