/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { TPayment } from './payment.interface'
import AppError from '../../errors/appError'
import axios from 'axios'
import Doctor from '../doctor/doctor.model'
import Patient from '../patient/patient.model'
import Appointment from '../appointment/appointment.model'

const initPayment = async (payload: TPayment) => {
  const { amount, name, email, phone, doctor, patient,
    schedule,
    status,
    appointmentType,
    symptoms } = payload
  const trans_id = `trans_DE_${amount?.total}_${Date.now()}`



  const isExistDoctor = await Doctor.findById(doctor)
  const isExistPatient = await Patient.findById(patient)
  if (!payload.schedule) {
    throw new Error('Schedule is required')
  }
  const isExistSchedule = await Appointment.findOne({
    doctor: doctor,
    patient: patient,
    schedule: new Date(payload.schedule),
  })
  if (!isExistDoctor) {
    throw new Error('Doctor not found')
  }
  if (!isExistPatient) {
    throw new Error('Patient not found')
  }
  if (isExistSchedule) {
    throw new Error('Schedule already exist')
  }

  const amountStr = encodeURIComponent(JSON.stringify(amount));

  // console.log({
  //   trans_id, amount, name, email, phone, doctor, patient,
  //   schedule,
  //   status,
  //   appointmentType,
  //   symptoms, doctorCode: isExistDoctor?.doctorCode,
  //   amountStr, isExistSchedule
  // });

  const queryParams: Record<string, any> = {
    doctor,
    doctorCode: isExistDoctor?.doctorCode,
    schedule,
    patient,
    status,
    appointmentType,
    symptoms,
    amount: amountStr,
    trans_id
  };
  Object.keys(queryParams).forEach(key => {
    if (!queryParams[key]) {
      delete queryParams[key];
    }
  });
  const queryString = new URLSearchParams(queryParams).toString();




  try {

    const paymentInfo = {
      store_id: 'aamarpaytest',
      tran_id: trans_id,
      signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
      success_url: `${process.env.SERVER_URL}/api/v1/payment?${queryString}`,
      fail_url: `${process.env.SERVER_URL}/api/v1/payment-gateway/failed?${queryString}`,
      cancel_url: `${process.env.CLIENT_URL}/doctor/${isExistDoctor?.doctorCode}/checkout/cancelled?${queryString}`,
      currency: 'BDT',
      cus_name: name,
      cus_email: email,
      cus_phone: phone,
      amount: Number(amount?.total),
      desc: 'Merchant Registration Payment',
      cus_city: 'Dhaka', //optional
      cus_state: 'Dhaka', //optional
      cus_postcode: '1206',
      cus_country: 'Bangladesh', //optional
      type: 'json',
    }

    const res = await axios.post(
      'https://sandbox.aamarpay.com/jsonpost.php',
      paymentInfo,
    )
    if (res.data && res.data.result) {
      return res.data
    } else {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Payment failed')
    }
  } catch (error: any) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      error.message || 'An error occurred during the payment process',
    )
  }
}

export const paymentServices = {
  initPayment,
}
