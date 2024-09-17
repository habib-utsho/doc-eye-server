import { z } from 'zod'
import { Types } from 'mongoose'

const createDoctorZodSchema = z.object({
  user: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid user ID format.',
  }),
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email format.'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long.'),
  gender: z.enum(['Male', 'Female'], { required_error: 'Gender is required.' }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], {
    required_error: 'Blood group is required.',
  }),
  bio: z.string().optional(), // Optional field
  doctorTitle: z.enum(
    ['Dr.', 'Prof. Dr.', 'Assoc. Prof. Dr.', 'Asst. Prof. Dr.'],
    { required_error: 'Doctor title is required.' },
  ),
  doctorType: z.enum(['Medical', 'Dental', 'Veterinary'], {
    required_error: 'Doctor type is required.',
  }),
  medicalSpecialty: z.array(z.string()).optional(), // Array of medical specialties
  totalExperienceYear: z
    .number()
    .int()
    .nonnegative('Experience must be a non-negative integer.'),
  medicalDegree: z.string().optional(), // Optional field
  consultationFee: z
    .number()
    .positive('Consultation fee must be a positive number.'),
  followupFee: z.number().positive('Follow-up fee must be a positive number.'),
  workingExperiences: z.array(
    z.object({
      workPlace: z.string(),
      department: z.string(),
      designation: z.string(),
      workingPeriod: z.string(),
    }),
  ),
  dateOfBirth: z.date().refine((date) => date < new Date(), {
    message: 'Date of birth must be in the past.',
  }),
  currentWorkplace: z.string(),
  availability: z.object({
    dayStart: z.string(),
    dayEnd: z.string(),
    timeStart: z.string(),
    timeEnd: z.string(),
  }),
  district: z.enum(
    [
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
    ],
    { required_error: 'District is required.' },
  ),
  NID: z.number().int().nonnegative('NID must be a positive integer.'),
  BMDC: z.number().int().nonnegative('BMDC must be a positive integer.'),
  status: z
    .enum(['pending', 'approve', 'reject'], {
      required_error: 'Status is required.',
    })
    .default('pending'),
  isDeleted: z.boolean().default(false), // Default value
})

// Export the schema
export { createDoctorZodSchema }
