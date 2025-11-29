import nodemailer from "nodemailer";
import { Resend } from "resend";
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";

type TPayload = {
  toEmail: string;
  text: string;
  subject: string;
  html: string;
};
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


const resend = new Resend(process.env.RESEND_API_KEY);
export const sendEmail = async (payload: TPayload) => {
  try {
    const { data, error } = await resend.emails.send({
      // from: 'DocEye 🩺 <utsho926@gmail.com>', // Replace with your verified domain/email
      from: 'DocEye 🩺 <doceye@resend.dev>', // Replace with your verified domain/email
      to: [payload.toEmail],
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error?.message || 'Failed to send email');
    }

    console.log('Email sent successfully via Resend');
  } catch (error: any) {
    console.error('Email send failed:', error.message);
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, error?.message || 'Failed to send reset email');
  }
};