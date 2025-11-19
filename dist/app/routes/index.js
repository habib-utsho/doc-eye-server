"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../module/auth/auth.route");
const appointment_route_1 = require("../module/appointment/appointment.route");
const doctor_route_1 = require("../module/doctor/doctor.route");
const admin_route_1 = require("../module/admin/admin.route");
const patient_route_1 = require("../module/patient/patient.route");
const user_route_1 = require("../module/user/user.route");
const specialty_route_1 = require("../module/specialty/specialty.route");
const payment_route_1 = require("../module/payment/payment.route");
const review_route_1 = require("../module/review/review.route");
const medicalReport_route_1 = require("../module/medicalReport/medicalReport.route");
const message_route_1 = require("../module/message/message.route");
const stats_route_1 = require("../module/stats/stats.route");
const payment_route_2 = require("../module/paymentGateway/payment.route");
const router = (0, express_1.Router)();
const routes = [
    {
        path: '/auth',
        route: auth_route_1.authRouter,
    },
    {
        path: '/user',
        route: user_route_1.userRouter,
    },
    {
        path: '/specialty',
        route: specialty_route_1.specialtyRouter,
    },
    {
        path: '/patient',
        route: patient_route_1.patientRouter,
    },
    {
        path: '/doctor',
        route: doctor_route_1.doctorRouter,
    },
    {
        path: '/admin',
        route: admin_route_1.adminRouter,
    },
    {
        path: '/appointment',
        route: appointment_route_1.appointmentRouter,
    },
    {
        path: '/payment',
        route: payment_route_1.paymentRouter,
    },
    {
        path: '/payment-gateway',
        route: payment_route_2.paymentRouter2,
    },
    {
        path: '/review',
        route: review_route_1.reviewRouter,
    },
    {
        path: '/medical-report',
        route: medicalReport_route_1.medicalReportRouter,
    },
    {
        path: '/message',
        route: message_route_1.messageRouter,
    },
    {
        path: '/stats',
        route: stats_route_1.statsRouter,
    },
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
