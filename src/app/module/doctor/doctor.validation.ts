import { z } from 'zod'

const createDoctorZodSchema = z.object({
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long.')
    .optional(),
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
  medicalSpecialties: z.array(z.string()).optional(), // Array of medical specialties
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
      workingPeriodStart: z.string(),
      workingPeriodEnd: z.string(),
    }),
  ),
  dateOfBirth: z.string({ required_error: 'Date of birth is required.' }),
  currentWorkplace: z.string(),
  availability: z.object({
    dayStart: z.string(
      z.enum([
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ]),
    ),
    dayEnd: z.string(
      z.enum([
        'Saturday',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ]),
    ),
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
  nid: z.string({ required_error: 'Nid is required.' }),
  bmdc: z.string({ required_error: 'bmdc is required.' }),
  status: z
    .enum(['pending', 'approve', 'reject'], {
      required_error: 'Status is required.',
    })
    .default('pending'),
  isDeleted: z.boolean().default(false), // Default value
})

// Export the schema
export { createDoctorZodSchema }
