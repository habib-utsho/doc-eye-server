import { z } from 'zod'
import { Types } from 'mongoose'

const createPatientZodSchema = z.object({
  user: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: 'Invalid user ID format.',
  }),
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email format.'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long.'),
  profileImg: z.string().optional(), // Optional field
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required.',
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
  dateOfBirth: z
    .date({ required_error: 'Date of birth is required.' })
    .refine((date) => date < new Date(), {
      message: 'Date of birth must be in the past.',
    }),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O+'], {
    required_error: 'Blood group is required.',
  }),
  weight: z.number().optional(), // Optional field
  height: z.number().optional(), // Optional field
  allergies: z.string().optional(), // Optional field
  isDeleted: z.boolean().default(false), // Default value
})

export { createPatientZodSchema }
