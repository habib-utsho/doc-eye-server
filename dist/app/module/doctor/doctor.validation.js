"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorZodSchema = void 0;
const zod_1 = require("zod");
const createDoctorZodSchema = zod_1.z.object({
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters long.')
        .optional(),
    name: zod_1.z.string().min(1, 'Name is required.'),
    email: zod_1.z.string().email('Invalid email format.'),
    phone: zod_1.z
        .string()
        .min(10, 'Phone number must be at least 10 characters long.'),
    gender: zod_1.z.enum(['Male', 'Female'], { required_error: 'Gender is required.' }),
    bloodGroup: zod_1.z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
        required_error: 'Blood group is required.',
    }),
    bio: zod_1.z.string().optional(), // Optional field
    doctorTitle: zod_1.z.enum(['Dr.', 'Prof. Dr.', 'Assoc. Prof. Dr.', 'Asst. Prof. Dr.'], { required_error: 'Doctor title is required.' }),
    doctorType: zod_1.z.enum(['Medical', 'Dental', 'Veterinary'], {
        required_error: 'Doctor type is required.',
    }),
    medicalSpecialty: zod_1.z.array(zod_1.z.string()).optional(), // Array of medical specialties
    totalExperienceYear: zod_1.z
        .number()
        .int()
        .nonnegative('Experience must be a non-negative integer.'),
    medicalDegree: zod_1.z.string().optional(), // Optional field
    consultationFee: zod_1.z
        .number()
        .positive('Consultation fee must be a positive number.'),
    followupFee: zod_1.z.number().positive('Follow-up fee must be a positive number.'),
    workingExperiences: zod_1.z.array(zod_1.z.object({
        workPlace: zod_1.z.string(),
        department: zod_1.z.string(),
        designation: zod_1.z.string(),
        workingPeriodStart: zod_1.z.string(),
        workingPeriodEnd: zod_1.z.string(),
    })),
    dateOfBirth: zod_1.z.string({ required_error: 'Date of birth is required.' }),
    currentWorkplace: zod_1.z.string(),
    availability: zod_1.z.object({
        dayStart: zod_1.z.string(zod_1.z.enum([
            'Saturday',
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
        ])),
        dayEnd: zod_1.z.string(zod_1.z.enum([
            'Saturday',
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
        ])),
        timeStart: zod_1.z.string(),
        timeEnd: zod_1.z.string(),
    }),
    district: zod_1.z.enum([
        'Dhaka',
        'Faridpur',
        'Gazipur',
        'Gopalganj',
        'Jamalpur',
        'Kishoreganj',
        'Madaripur',
        'Manikganj',
        'Munshiganj',
        'Mymensingh',
        'Narayanganj',
        'Narsingdi',
        'Netrokona',
        'Rajbari',
        'Shariatpur',
        'Sherpur',
        'Tangail',
        'Bogra',
        'Joypurhat',
        'Naogaon',
        'Natore',
        'Chapainawabganj',
        'Pabna',
        'Rajshahi',
        'Sirajganj',
        'Dinajpur',
        'Gaibandha',
        'Kurigram',
        'Lalmonirhat',
        'Nilphamari',
        'Panchagarh',
        'Rangpur',
        'Thakurgaon',
        'Barguna',
        'Barishal',
        'Bhola',
        'Jhalokati',
        'Patuakhali',
        'Pirojpur',
        'Bandarban',
        'Brahmanbaria',
        'Chandpur',
        'Chattogram',
        'Cumilla',
        "Cox's Bazar",
        'Feni',
        'Khagrachari',
        'Lakshmipur',
        'Noakhali',
        'Rangamati',
        'Habiganj',
        'Moulvibazar',
        'Sunamganj',
        'Sylhet',
        'Bagerhat',
        'Chuadanga',
        'Jessore',
        'Jhenaidah',
        'Khulna',
        'Kushtia',
        'Magura',
        'Meherpur',
        'Narail',
        'Satkhira',
    ], { required_error: 'District is required.' }),
    nid: zod_1.z.string({ required_error: 'Nid is required.' }),
    bmdc: zod_1.z.string({ required_error: 'bmdc is required.' }),
    status: zod_1.z
        .enum(['pending', 'approve', 'reject'], {
        required_error: 'Status is required.',
    })
        .default('pending'),
    isDeleted: zod_1.z.boolean().default(false), // Default value
});
exports.createDoctorZodSchema = createDoctorZodSchema;
