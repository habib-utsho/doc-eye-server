import { Types } from 'mongoose'

export type TDistrict =
  | 'Dhaka'
  | 'Faridpur'
  | 'Gazipur'
  | 'Gopalganj'
  | 'Jamalpur'
  | 'Kishoreganj'
  | 'Madaripur'
  | 'Manikganj'
  | 'Munshiganj'
  | 'Mymensingh'
  | 'Narayanganj'
  | 'Narsingdi'
  | 'Netrokona'
  | 'Rajbari'
  | 'Shariatpur'
  | 'Sherpur'
  | 'Tangail'
  | 'Bogra'
  | 'Joypurhat'
  | 'Naogaon'
  | 'Natore'
  | 'Chapainawabganj'
  | 'Pabna'
  | 'Rajshahi'
  | 'Sirajganj'
  | 'Dinajpur'
  | 'Gaibandha'
  | 'Kurigram'
  | 'Lalmonirhat'
  | 'Nilphamari'
  | 'Panchagarh'
  | 'Rangpur'
  | 'Thakurgaon'
  | 'Barguna'
  | 'Barishal'
  | 'Bhola'
  | 'Jhalokati'
  | 'Patuakhali'
  | 'Pirojpur'
  | 'Bandarban'
  | 'Brahmanbaria'
  | 'Chandpur'
  | 'Chattogram'
  | 'Cumilla'
  | "Cox's Bazar"
  | 'Feni'
  | 'Khagrachari'
  | 'Lakshmipur'
  | 'Noakhali'
  | 'Rangamati'
  | 'Habiganj'
  | 'Moulvibazar'
  | 'Sunamganj'
  | 'Sylhet'
  | 'Bagerhat'
  | 'Chuadanga'
  | 'Jessore'
  | 'Jhenaidah'
  | 'Khulna'
  | 'Kushtia'
  | 'Magura'
  | 'Meherpur'
  | 'Narail'
  | 'Satkhira'
export type TBloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
export type TGender = 'Male' | 'Female' | 'Other'

export type TPatient = {
  _id: Types.ObjectId
  user: Types.ObjectId
  name: string
  email: string
  phone: string
  profileImg?: string
  gender: TGender
  district: TDistrict
  dateOfBirth: Date
  bloodGroup: TBloodGroup
  favoriteDoctors: Types.ObjectId[]
  weight?: number
  height?: number
  allergies?: string
  isDeleted: boolean
}
