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
const http_status_codes_1 = require("http-status-codes");
const appError_1 = __importDefault(require("../../errors/appError"));
const appointment_model_1 = __importDefault(require("./appointment.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const getAllAppointments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const dateFilter = {};
    if (query.date) {
        const date = new Date(query.date);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        dateFilter.schedule = {
            $gte: date.toISOString(),
            $lt: nextDay.toISOString(),
        };
    }
    if (query.state) {
        const currentDate = new Date();
        if (query.state === 'upcoming') {
            dateFilter.schedule = { $gte: currentDate };
        }
        else if (query.state === 'expired') {
            dateFilter.schedule = { $lt: currentDate };
        }
    }
    delete query.date;
    delete query.state;
    const appointmentQuery = new QueryBuilder_1.default(appointment_model_1.default.find(), Object.assign(Object.assign(Object.assign({}, query), dateFilter), { sort: `${query.sort} -schedule` }))
        .filterQuery()
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()
        .populateQuery([
        { path: 'doctor', select: '-createdAt -updatedAt -__v' },
        { path: 'patient', select: '-createdAt -updatedAt -__v' },
        { path: 'payment', select: '-createdAt -updatedAt -__v' },
    ]);
    const result = yield (appointmentQuery === null || appointmentQuery === void 0 ? void 0 : appointmentQuery.queryModel);
    const total = yield appointment_model_1.default.countDocuments(appointmentQuery.queryModel.getFilter());
    return { data: result, total };
});
const getAppointmentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.default.findById(id)
        .select('-__v')
        .populate('doctor', '-createdAt -updatedAt -__v')
        .populate('patient', '-createdAt -updatedAt -__v')
        .populate('payment', '-createdAt -updatedAt -__v');
    if (!appointment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Appointment not found');
    }
    return appointment;
});
const updateAppointmentStatusById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const appointment = yield appointment_model_1.default.findById(id);
    if (!appointment) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Appointment not found');
    }
    if (appointment.status === 'completed' || appointment.status === 'canceled') {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Appointment is already ${appointment.status}`);
    }
    if (appointment.status === 'pending' &&
        !['confirmed', 'canceled'].includes(payload.status)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Status is either confirmed or canceled while appointment is pending');
    }
    if (appointment.status === 'confirmed' &&
        !['completed', 'canceled'].includes(payload.status)) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Status is either completed or canceled while appointment is confirmed');
    }
    if (appointment.status === 'confirmed' && payload.status === 'completed') {
        const appointmentScheduleTime = new Date(appointment.schedule).getTime();
        const currentTime = new Date().getTime();
        const diff = appointmentScheduleTime - currentTime;
        if (diff > 0) {
            throw new appError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'Only completed status is allowed after appointment time');
        }
    }
    const result = yield appointment_model_1.default.findByIdAndUpdate(id, { status: payload.status }, {
        new: true,
    });
    if (!result) {
        throw new appError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'Appointment not updated');
    }
    return result;
});
exports.appointmentService = {
    getAllAppointments,
    getAppointmentById,
    updateAppointmentStatusById,
};
