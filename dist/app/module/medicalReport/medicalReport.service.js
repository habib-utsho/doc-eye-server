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
exports.medicalReportService = void 0;
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const medicalReport_model_1 = __importDefault(require("./medicalReport.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const appointment_model_1 = __importDefault(require("../appointment/appointment.model"));
const patient_model_1 = __importDefault(require("../patient/patient.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendEmail_1 = require("../../utils/sendEmail");
const createMedicalReport = (payload, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        // Ensure patient exists
        const patient = yield patient_model_1.default.findById(payload.patient);
        if (!patient) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Patient not found');
        }
        // Ensure appointment exists
        const appointmentExists = yield appointment_model_1.default.findById(payload.appointment);
        if (!appointmentExists) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Appointment not found');
        }
        if (appointmentExists.doctor.toString() !== user._id) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are not authorized to create this medical report');
        }
        if (appointmentExists.status !== 'confirmed') {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Medical report can only be created for confirmed appointments');
        }
        // Create medical report
        const report = yield medicalReport_model_1.default.create([payload], { session });
        const appointment = yield appointment_model_1.default.findByIdAndUpdate(payload.appointment, { status: 'completed' }, { new: true, session });
        yield (0, sendEmail_1.sendEmail)({
            toEmail: patient === null || patient === void 0 ? void 0 : patient.email,
            subject: `Your Medical Report is Ready – DocEye`,
            text: `Dear ${patient.name},\n\nYour medical report has been prepared by the doctor. Please log in to view the full details including prescriptions and advice.\n\nBest regards,\nDocEye Team`,
            html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Medical Report is Ready</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 650px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #2b6cb0, #1e40af); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; }
        .content { padding: 30px; color: #333; }
        .section { margin-bottom: 24px; }
        .section h2 { color: #1e40af; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; font-size: 18px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background-color: #edf2f7; color: #2d3748; font-weight: 600; }
        .btn {
          display: inline-block;
          background: #1e40af;
          color: white !important;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer { background:center; padding: 20px; background: #1a365d; color: #a0aec0; font-size: 14px; }
        .highlight { background: #fffaf0; padding: 16px; border-left: 4px solid #f6ad55; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DocEye</h1>
          <p style="margin:8px 0 0; font-size:16px;">Your Health, Our Priority</p>
        </div>

        <div class="content">
          <h2 style="color:#1e40af; border:none; margin-top:0;">Dear ${patient.name},</h2>
          <p>Your consultation has been completed and the medical report is now ready.</p>

          <div class="section">
            <h2>Reported Problems</h2>
            <ul>
              ${payload.problems.map((p) => `<li style="margin:6px 0;">${p}</li>`).join('')}
            </ul>
          </div>

          <div class="section">
            <h2>Diagnosis</h2>
            <p class="highlight"><strong>${payload.diagnosis}</strong></p>
          </div>

          <div class="section">
            <h2>Prescribed Medications</h2>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Dosage</th>
                  <th>Frequency</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                ${(_a = payload === null || payload === void 0 ? void 0 : payload.medications) === null || _a === void 0 ? void 0 : _a.map((med) => `
                  <tr>
                    <td><strong>${med.name}</strong></td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                    <td>${med.duration}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          ${payload.advices && payload.advices.length > 0 ? `
          <div class="section">
            <h2>Doctor's Advice</h2>
            <ul>
              ${payload.advices.map((advice) => `<li style="margin:8px 0;">${advice}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${payload.followUpDate ? `
          <div class="section">
            <h2>Next Follow-Up</h2>
            <p class="highlight">Please schedule your next visit on <strong>${new Date(payload.followUpDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
          </div>
          ` : ''}

          <div style="text-align:center">
            <a href="${process.env.CLIENT_URL}/dashboard/patient/consultation-history/${report[0]._id}" class="btn">
              View Full Medical Report & History
            </a>
          </div>

          <p>If you have any questions, feel free to reply to this email or contact us via the portal.</p>
          <p>Thank you for trusting <strong>DocEye</strong> with your healthcare.</p>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} DocEye. All rights reserved.<br>
          This is an automated message, please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `,
        });
        yield session.commitTransaction();
        session.endSession();
        return { report: report[0], appointment };
    }
    catch (err) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, err.message);
    }
});
const getAllMedicalReports = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const reportQuery = new QueryBuilder_1.default(medicalReport_model_1.default.find(), Object.assign(Object.assign({}, query), { sort: `${query.sort} -createdAt` }))
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        {
            path: 'doctor',
            select: '_id doctorTitle doctorType doctorCode name profileImg email',
        },
        {
            path: 'patient',
            select: '_id name gender dateOfBirth profileImg weight email',
        },
        { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield reportQuery.queryModel;
    const total = yield medicalReport_model_1.default.countDocuments(reportQuery.queryModel.getFilter());
    return { data: result, total };
});
const getMedicalReportById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const report = yield medicalReport_model_1.default.findById(id)
        .select('-__v')
        .populate('doctor', '_id doctorTitle doctorType doctorCode name profileImg email currentWorkplace medicalDegree')
        .populate('patient', '_id name profileImg email gender weight dateOfBirth bloodGroup')
        .populate({
        path: 'appointment',
        select: '-createdAt -updatedAt -__v',
        populate: 'payment',
    });
    if (!report) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Medical report not found');
    }
    return report;
});
exports.medicalReportService = {
    createMedicalReport,
    getAllMedicalReports,
    getMedicalReportById,
};
