import { Types } from 'mongoose'

export type TMedicalReport = {
    appointment: Types.ObjectId
    doctor: Types.ObjectId
    patient: Types.ObjectId
    problems: string[] // "Blood in sputum" , "Chest pain" 
    diagnosis: string  // Cough fissure
    medications: {
        name: string; // "Paracetamol"
        dosage: string; // "500mg"
        frequency: string; // "Twice a day"
        duration: string; // "5 days"
    }[];
    advices: string[] | null // "Take rest and drink plenty of fluids" 
    tests: string[] | null // "Blood test, X-ray"
    followUpDate: Date | null // 2023-10-01
    
}