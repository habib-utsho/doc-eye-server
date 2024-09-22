"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminZodSchema = void 0;
const zod_1 = require("zod");
const createAdminZodSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required.'),
    email: zod_1.z
        .string({ required_error: 'Email is required.' })
        .email('Invalid email format.'),
    phone: zod_1.z.string({ required_error: 'Phone number is required.' }),
    gender: zod_1.z.enum(['Male', 'Female', 'Other'], {
        required_error: 'Gender is required.',
    }),
    dateOfBirth: zod_1.z.string({ required_error: 'Date of birth is required.' }),
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
    isDeleted: zod_1.z.boolean().default(false), // Default value
});
exports.createAdminZodSchema = createAdminZodSchema;
