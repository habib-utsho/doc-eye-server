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
exports.paymentServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const axios_1 = __importDefault(require("axios"));
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const appointment_model_1 = __importDefault(require("../appointment/appointment.model"));
const initPayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, name, email, phone, doctor, patient, schedule, status, appointmentType, symptoms } = payload;
    const trans_id = `trans_DE_${amount === null || amount === void 0 ? void 0 : amount.total}_${Date.now()}`;
    const isExistDoctor = yield doctor_model_1.default.findById(doctor);
    const isExistPatient = yield patient_model_1.default.findById(patient);
    if (!payload.schedule) {
        throw new Error('Schedule is required');
    }
    const isExistSchedule = yield appointment_model_1.default.findOne({
        doctor: doctor,
        patient: patient,
        schedule: new Date(payload.schedule),
    });
    if (!isExistDoctor) {
        throw new Error('Doctor not found');
    }
    if (!isExistPatient) {
        throw new Error('Patient not found');
    }
    if (isExistSchedule) {
        throw new Error('Schedule already exist');
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
    const queryParams = {
        doctor,
        doctorCode: isExistDoctor === null || isExistDoctor === void 0 ? void 0 : isExistDoctor.doctorCode,
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
    ;
    try {
        const paymentInfo = {
            store_id: 'aamarpaytest',
            tran_id: trans_id,
            signature_key: 'dbb74894e82415a2f7ff0ec3a97e4183',
            success_url: `${process.env.SERVER_URL}/api/v1/payment?${queryString}`,
            fail_url: `${process.env.SERVER_URL}/api/v1/payment-gateway/failed?${queryString}`,
            cancel_url: `${process.env.CLIENT_URL}/doctor/${isExistDoctor === null || isExistDoctor === void 0 ? void 0 : isExistDoctor.doctorCode}/checkout/cancelled?${queryString}`,
            currency: 'BDT',
            cus_name: name,
            cus_email: email,
            cus_phone: phone,
            amount: Number(amount === null || amount === void 0 ? void 0 : amount.total),
            desc: 'Merchant Registration Payment',
            cus_city: 'Dhaka', //optional
            cus_state: 'Dhaka', //optional
            cus_postcode: '1206',
            cus_country: 'Bangladesh', //optional
            type: 'json',
        };
        const res = yield axios_1.default.post('https://sandbox.aamarpay.com/jsonpost.php', paymentInfo);
        if (res.data && res.data.result) {
            return res.data;
        }
        else {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Payment failed');
        }
    }
    catch (error) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, error.message || 'An error occurred during the payment process');
    }
});
exports.paymentServices = {
    initPayment,
};
