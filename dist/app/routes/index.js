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
        path: '/appointment',
        route: appointment_route_1.appointmentRouter,
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
];
routes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
