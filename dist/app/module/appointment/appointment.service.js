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
exports.appointmentService = void 0;
const doctor_model_1 = __importDefault(require("../doctor/doctor.model"));
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const appointment_model_1 = __importDefault(require("./appointment.model"));
const createAppointment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctor, patient } = payload;
    const isExistDoctor = yield doctor_model_1.default.findById(doctor);
    const isExistPatient = yield patient_model_1.default.findById(patient);
    if (!isExistDoctor) {
        throw new Error('Doctor not found');
    }
    if (!isExistPatient) {
        throw new Error('Patient not found');
    }
    const result = yield appointment_model_1.default.create(payload);
    return result;
});
exports.appointmentService = {
    createAppointment,
};
