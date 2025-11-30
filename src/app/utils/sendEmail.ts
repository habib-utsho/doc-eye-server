
import AppError from "../errors/appError";
import { StatusCodes } from "http-status-codes";
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, SendSmtpEmail } from '@getbrevo/brevo';

type TPayload = {
  toEmail: string;
  text: string;
  subject: string;
  html: string;
};

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





const apiInstance = new TransactionalEmailsApi();

apiInstance.setApiKey(
  TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY!
);

export const sendEmail = async (payload: TPayload) => {
  const email = new SendSmtpEmail();

  email.sender = { name: 'DocEye', email: 'utsho926@gmail.com' };
  email.to = [{ email: payload.toEmail }];
  email.subject = payload.subject;
  email.textContent = payload.text;
  email.htmlContent = payload.html;

  try {
    // Brevo returns { response, body } — the actual messageId is inside body
    const result = await apiInstance.sendTransacEmail(email);

    // body.messageId exists in real responses (even if TS doesn't know it yet)
    const messageId = (result.body as any)?.messageId || 'unknown';

    console.log('Email sent via Brevo →', messageId);
    return result;
  } catch (error: any) {
    console.error('Brevo error:', error?.body || error.message || error);
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send email');
  }
};