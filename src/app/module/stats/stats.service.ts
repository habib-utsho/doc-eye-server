import { JwtPayload } from 'jsonwebtoken'
import Patient from '../patient/patient.model'
import Doctor from '../doctor/doctor.model'
import Admin from '../admin/admin.model'
import Appointment from '../appointment/appointment.model'
import Payment from '../payment/payment.model'
import { Types } from 'mongoose'
import Review from '../review/review.model'



const getPatientStats = async (pPatient: JwtPayload) => {


  const patient = await Patient.findOne({ user: pPatient?._id })

  return { demo: "Hi" }
}
const getDoctorStats = async (pDoctor: JwtPayload) => {
  console.log({ pDoctor });
  const totalAppointments = await Appointment.find({ doctor: pDoctor?._id }).countDocuments();
  const totalPendingAppointments = await Appointment.find({ status: "pending", doctor: pDoctor?._id }).countDocuments();
  const totalConfirmedAppointments = await Appointment.find({ status: "confirmed", doctor: pDoctor?._id }).countDocuments();
  const totalCompletedAppointments = await Appointment.find({ status: "completed", doctor: pDoctor?._id }).countDocuments();
  const totalCanceledAppointments = await Appointment.find({ status: "canceled", doctor: pDoctor?._id }).countDocuments();

  // Review stats
  const highlySatisfiedPatients = await Review.find({
    doctor: pDoctor?._id,
    rating: { $gte: 4 },
  }).countDocuments();

  const moderatelySatisfiedPatients = await Review.find({
    doctor: pDoctor?._id,
    rating: 3,
  }).countDocuments();

  const dissatisfiedPatients = await Review.find({
    doctor: pDoctor?._id,
    rating: { $lte: 2 },
  }).countDocuments();
  const totalReviews = await Review.find({ doctor: pDoctor?._id }).countDocuments();
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

  const doctor = await Doctor.findById(pDoctor?._id)
  console.log({ pDoctor, totalAppointments, totalAmount, totalPayments });


  return { doctor, totalAppointments, totalPendingAppointments, totalConfirmedAppointments, totalCanceledAppointments, totalCompletedAppointments, totalAmount, totalPayments, highlySatisfiedPatients, moderatelySatisfiedPatients, dissatisfiedPatients, totalReviews, averageRating }
}


const getAdminStats = async () => {


  const admins = await Admin.find({})

  return { adminsCount: admins.length }
}


export const statsService = {
  getPatientStats,
  getDoctorStats,
  getAdminStats
}
