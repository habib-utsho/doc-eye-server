/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from 'jsonwebtoken'
import Patient from '../patient/patient.model'
import Doctor from '../doctor/doctor.model'
import Admin from '../admin/admin.model'
import Appointment from '../appointment/appointment.model'
import Payment from '../payment/payment.model'
import { Types } from 'mongoose'
import Review from '../review/review.model'
import AppError from '../../errors/appError'
import { StatusCodes } from 'http-status-codes'



const getPatientStats = async (pPatient: JwtPayload) => {

  const patient = await Patient.findById(pPatient?._id)
  if (!patient) throw new AppError(StatusCodes.UNAUTHORIZED, "Patient not found")



  // Appointment stats
  const totalAppointments = await Appointment.find({ patient: patient?._id }).countDocuments();
  const totalPendingAppointments = await Appointment.find({ patient: patient?._id, status: "pending" }).countDocuments();
  const totalConfirmedAppointments = await Appointment.find({ patient: patient?._id, status: "confirmed" }).countDocuments();
  const totalCompletedAppointments = await Appointment.find({ patient: patient?._id, status: "completed" }).countDocuments();
  const totalCanceledAppointments = await Appointment.find({ patient: patient?._id, status: "canceled" }).countDocuments();

  const mostConsultedDoctor = await Appointment.aggregate([
    {
      $match: { patient: new Types.ObjectId(patient?._id) },
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
  const paymentsAgg = await Payment.aggregate([
    {
      $match: {
        patient: new Types.ObjectId(patient?._id),
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

  const totalAmount = paymentsAgg[0]?.totalAmount || 0;
  const totalPayments = paymentsAgg[0]?.totalPayments || 0;

  // Review stats
  const totalReviews = await Review.find({ patient: patient?._id }).countDocuments();

  // Optional: distinct doctors consulted
  const distinctDoctors = await Appointment.distinct("doctor", { patient: patient?._id });

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
}


const getDoctorStats = async (pDoctor: JwtPayload) => {
  const doctor = await Doctor.findById(pDoctor?._id)
  if (!doctor) throw new AppError(StatusCodes.UNAUTHORIZED, "Doctor not found")



  const totalAppointments = await Appointment.find({ doctor: doctor?._id }).countDocuments();
  const totalPendingAppointments = await Appointment.find({ status: "pending", doctor: doctor?._id }).countDocuments();
  const totalConfirmedAppointments = await Appointment.find({ status: "confirmed", doctor: doctor?._id }).countDocuments();
  const totalCompletedAppointments = await Appointment.find({ status: "completed", doctor: doctor?._id }).countDocuments();
  const totalCanceledAppointments = await Appointment.find({ status: "canceled", doctor: doctor?._id }).countDocuments();

  // Review stats
  const highlySatisfiedPatients = await Review.find({
    doctor: doctor?._id,
    rating: { $gte: 4 },
  }).countDocuments();

  const moderatelySatisfiedPatients = await Review.find({
    doctor: doctor?._id,
    rating: 3,
  }).countDocuments();

  const dissatisfiedPatients = await Review.find({
    doctor: doctor?._id,
    rating: { $lte: 2 },
  }).countDocuments();
  const totalReviews = await Review.find({ doctor: doctor?._id }).countDocuments();
  const averageRating = totalReviews > 0 ? (await Review.aggregate([
    { $match: { doctor: new Types.ObjectId(pDoctor._id) } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]))[0]?.avgRating?.toFixed(2) : 0;

  // Payment stats
  const paymentsAgg = await Payment.aggregate([
    {
      $match: {
        doctor: new Types.ObjectId(pDoctor._id),
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


  const totalAmount = paymentsAgg[0]?.totalAmount || 0;
  const totalPayments = paymentsAgg[0]?.totalPayments || 0;



  return { doctor, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating }
}


const getAdminStats = async (pAdmin: JwtPayload) => {
  const admin = await Admin.findById(pAdmin?._id)
  if (!admin) throw new AppError(StatusCodes.UNAUTHORIZED, "Admin not found")

  const totalAppointments = await Appointment.find().countDocuments();
  const totalPendingAppointments = await Appointment.find({ status: "pending" }).countDocuments();
  const totalConfirmedAppointments = await Appointment.find({ status: "confirmed" }).countDocuments();
  const totalCompletedAppointments = await Appointment.find({ status: "completed" }).countDocuments();
  const totalCanceledAppointments = await Appointment.find({ status: "canceled" }).countDocuments();
  const totalPatients = await Patient.find().countDocuments();
  const totalDoctors = await Doctor.find().countDocuments();

  // Review stats
  const highlySatisfiedPatients = await Review.find({
    rating: { $gte: 4 },
  }).countDocuments();

  const moderatelySatisfiedPatients = await Review.find({
    rating: 3,
  }).countDocuments();

  const dissatisfiedPatients = await Review.find({
    rating: { $lte: 2 },
  }).countDocuments();
  const totalReviews = await Review.find().countDocuments();
  const averageRating = totalReviews > 0 ? (await Review.aggregate([
    { $group: { _id: null, avgRating: { $avg: "$rating" } } }
  ]))[0]?.avgRating?.toFixed(2) : 0;

  // Payment stats
  const paymentsAgg = await Payment.aggregate([
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


  const totalAmount = paymentsAgg[0]?.totalAmount || 0;
  const totalPayments = paymentsAgg[0]?.totalPayments || 0;



  return { admin, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating, totalPatients, totalDoctors }
}



const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getEarningsStats = async (pUser: JwtPayload, yearParam?: number) => {


  const { role, _id } = pUser || {}

  let user: any;
  if (role === "admin") {
    user = await Admin.findById(_id)
  } else if (role === 'doctor') {
    user = await Doctor.findById(_id)
  } else if (role === 'patient') {
    user = await Patient.findById(_id)
  }

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'You are not authorized to access this route')
  }

  // Determine year and month range
  const now = new Date()
  const year = yearParam ?? now.getFullYear()
  const isCurrentYear = year === now.getFullYear()
  const lastMonth = isCurrentYear ? now.getMonth() + 1 : 12 // 1..n inclusive

  // Range for the selected year
  const start = new Date(year, 0, 1)
  const end = new Date(year + 1, 0, 1)


  // Build match condition
  const match: any = {
    status: "confirmed",
    createdAt: { $gte: start, $lt: end },
  };

  if (role === "doctor") {
    match["doctor"] = user._id;
  } else if (role === "patient") {
    match["patient"] = user._id
  }

  // Aggregate confirmed payments by month for given year
  const monthlyAgg = await Payment.aggregate([
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
  ])

  // Map results by month number
  const byMonth: Record<number, { totalAmount: number; totalPayments: number }> = {}
  for (const m of monthlyAgg) {
    byMonth[m._id.month] = {
      totalAmount: m.totalAmount || 0,
      totalPayments: m.totalPayments || 0,
    }
  }

  // Build series from Jan to lastMonth (current year) or 12 (other years)
  const months = Array.from({ length: lastMonth }, (_, i) => {
    const monthNum = i + 1 // 1..lastMonth
    const data = byMonth[monthNum] ?? { totalAmount: 0, totalPayments: 0 }
    return {
      monthIndex: monthNum,            // 1-12
      month: monthNames[i],            // "January", ...
      totalAmount: data.totalAmount,
      totalPayments: data.totalPayments,
    }
  })

  const totals = months.reduce(
    (acc, m) => {
      acc.totalAmount += m.totalAmount
      acc.totalPayments += m.totalPayments
      return acc
    },
    { totalAmount: 0, totalPayments: 0 },
  )

  return {
    // user,
    year,
    months,                // month-wise series (Jan..current or full 12)
    totalAmount: totals.totalAmount,
    totalPayments: totals.totalPayments,
  }
}

export const statsService = {
  getPatientStats,
  getDoctorStats,
  getAdminStats,
  getEarningsStats
}
