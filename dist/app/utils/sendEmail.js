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
exports.sendEmail = void 0;
const appError_1 = __importDefault(require("../errors/appError"));
const http_status_codes_1 = require("http-status-codes");
const brevo_1 = require("@getbrevo/brevo");
// Nodemailer
// export const sendEmail = async (payload: TPayload) => {
//   const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     // secure: process.env.NODE_ENV === "production", // true for port 465, false for other ports
//     secure: false,
//     auth: {
//       user: process.env.NODE_MAILER_USER,
//       pass: process.env.NODE_MAILER_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false // Sometimes helps on some hosts
//     }
//   });
//   const mailData = {
//     from: '"DocEye 🩺" <utsho926@gmail.com>', // sender address
//     to: payload.toEmail, // list of receivers
//     subject: payload.subject, // Subject line
//     text: payload.text,
//     html: payload.html,
//   }
//   await transporter.sendMail(mailData);
// };
// Resend
// const resend = new Resend(process.env.RESEND_API_KEY);
// export const sendEmail = async (payload: TPayload) => {
//   try {
//     const { data, error } = await resend.emails.send({
//       // from: 'DocEye 🩺 <utsho926@gmail.com>', // Replace with your verified domain/email
//       from: 'DocEye 🩺 <doceye@resend.dev>', // Replace with your verified domain/email
//       to: [payload.toEmail],
//       subject: payload.subject,
//       text: payload.text,
//       html: payload.html,
//     });
//     if (error) {
//       console.error('Resend error:', error);
//       throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error?.message || 'Failed to send email');
//     }
//     console.log('Email sent successfully via Resend');
//   } catch (error: any) {
//     console.error('Email send failed:', error.message);
//     throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error?.message || 'Failed to send reset email');
//   }
// };
const apiInstance = new brevo_1.TransactionalEmailsApi();
apiInstance.setApiKey(brevo_1.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
const sendEmail = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = new brevo_1.SendSmtpEmail();
    email.sender = { name: 'DocEye', email: 'utsho926@gmail.com' };
    email.to = [{ email: payload.toEmail }];
    email.subject = payload.subject;
    email.textContent = payload.text;
    email.htmlContent = payload.html;
    try {
        // Brevo returns { response, body } — the actual messageId is inside body
        const result = yield apiInstance.sendTransacEmail(email);
        // body.messageId exists in real responses (even if TS doesn't know it yet)
        const messageId = ((_a = result.body) === null || _a === void 0 ? void 0 : _a.messageId) || 'unknown';
        console.log('Email sent via Brevo →', messageId);
        return result;
    }
    catch (error) {
        console.error('Brevo error:', (error === null || error === void 0 ? void 0 : error.body) || error.message || error);
        throw new appError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send email');
    }
});
exports.sendEmail = sendEmail;
