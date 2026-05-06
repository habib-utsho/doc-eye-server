import { StatusCodes } from 'http-status-codes'
import AppError from '../../errors/appError'
import MedicalReport from '../medicalReport/medicalReport.model'
import Appointment from '../appointment/appointment.model'
import Payment from '../payment/payment.model'
import Specialty from '../specialty/specialty.model'
import Doctor from '../doctor/doctor.model'
import Patient from '../patient/patient.model'
import Admin from '../admin/admin.model'
import Review from '../review/review.model'
import QueryBuilder from '../../builder/QueryBuilder'
import { Model, PopulateOptions } from 'mongoose'
// import { GoogleGenerativeAI } from '@google/generative-ai'
import { OpenAI } from 'openai'
import { TLlmResponse } from './talkToDb.interface'
import { collectionFields } from './talkToDb.constant'





// ─── Collection registry ──────────────────────────────────────────────────────

const COLLECTION_MODEL_MAP: Record<string, Model<any>> = {
    doctors: Doctor,
    patients: Patient,
    admins: Admin,
    medicalReports: MedicalReport,
    appointments: Appointment,
    payments: Payment,
    specialties: Specialty,
    reviews: Review,
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `
You are a MongoDB query assistant. Return ONLY a JSON object — no markdown, no explanation.

Today (UTC): ${new Date().toISOString()}

Collections:
doctors: name, email, phone, gender, bloodGroup, bio, doctorTitle, doctorType, medicalSpecialties[], totalExperienceYear, medicalDegree, consultationFee, followupFee, dateOfBirth, district, patientAttended, status['pending', 'approve', 'reject'], isDeleted
patients: name, email, phone, gender, district, dateOfBirth, bloodGroup, favoriteDoctors[], weight, height, allergies, isDeleted
admins: name, email, phone, gender, bloodGroup, dateOfBirth, district, isDeleted
medicalReports: appointment, doctor, patient, problems[], diagnosis, medications[{name,dosage,frequency,duration}], advices[], followUpDate
specialties: name, description, isDeleted
payments: trans_id, appointment, patient, doctor, amount{consultationFee,vat,platformFee,total}, paymentMethod, status
reviews: doctor, patient, rating, comment
appointments: doctor, patient, payment, schedule, appointmentType, symptoms, status

All collections have: createdAt, updatedAt. Ref fields are ObjectId.

Response shape:
{"collection":"<name>","filter":{<MongoDB filter>},"summary":"<human readable>","populate":[{"path":"<field>","select":"<fields>"}]}

Rules:
- Use today's date for relative time ("last 2 months", "this week" etc.)
- Always append {isDeleted:{$ne:true}} unless user asks for deleted records
- Use $gte/$lte/$in/$regex where appropriate. without any leading or trailing spaces. Do not quote the operator keys.
- Omit "populate" if no relational lookup needed
- Use {} filter if ambiguous, explain in summary
`.trim()

// ─── gemini  ────────────────────────────────────────────────────────────

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)





const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────


const COLLECTION_POPULATE_MAP: Record<string, PopulateOptions[]> = {
    [collectionFields.REVIEWS]: [
        { path: 'doctor', select: '_id doctorTitle name profileImg email' },
        { path: 'patient', select: '_id name profileImg email' },
    ],
    [collectionFields.APPOINTMENTS]: [
        { path: 'doctor', select: '-createdAt -updatedAt -__v' },
        { path: 'patient', select: '-createdAt -updatedAt -__v' },
        { path: 'payment', select: '-createdAt -updatedAt -__v' },
    ],
    [collectionFields.PAYMENTS]: [
        { path: 'appointment', select: '-createdAt -updatedAt -__v' },
        { path: 'doctor', select: 'name doctorTitle profileImg' },
        { path: 'patient', select: 'name profileImg' },
    ],
    [collectionFields.MEDICAL_REPORTS]: [
        { path: 'doctor', select: '_id doctorTitle doctorType doctorCode name profileImg email' },
        { path: 'patient', select: '_id name gender dateOfBirth profileImg weight email' },
        { path: 'appointment', select: '-createdAt -updatedAt -__v' },
    ],
    [collectionFields.DOCTORS]: [
        { path: 'user', select: '-createdAt -updatedAt -__v' },
        { path: 'medicalSpecialties', select: '-createdAt -updatedAt -__v' },
    ],
    [collectionFields.PATIENTS]: [
        { path: 'user', select: '-createdAt -updatedAt -__v' },
        { path: 'favoriteDoctors', select: '-createdAt -updatedAt -__v' },
    ],
    [collectionFields.ADMINS]: [
        { path: 'user', select: '-createdAt -updatedAt -__v' },
    ],
}

const resolveModel = (collection: string): Model<any> => {
    const model = COLLECTION_MODEL_MAP[collection]
    if (!model) {
        throw new AppError(
            StatusCodes.BAD_REQUEST,
            `Unknown collection "${collection}". Valid options: ${Object.keys(COLLECTION_MODEL_MAP).join(', ')}`,
        )
    }
    return model
}

const parseLlmJson = (raw: string): TLlmResponse => {
    try {
        return JSON.parse(raw) as TLlmResponse
    } catch {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'LLM returned malformed JSON. Try rephrasing your prompt.',
        )
    }
}

// const geminiModel = genAI.getGenerativeModel({
//     model: 'gemini-2.5-flash', // free tier model
//     generationConfig: {
//         temperature: 0,
//         responseMimeType: 'application/json', // forces pure JSON output — no markdown fences
//     },
//     systemInstruction: SYSTEM_PROMPT,
// })

const generateQueryFromLlm = async (prompt: string): Promise<TLlmResponse> => {
    if (!process.env.OPENAI_API_KEY) {
        throw new AppError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'OpenAI API key is not configured. Set the OPENAI_API_KEY environment variable.',
        )
    }

    // const result = await geminiModel.generateContent(prompt)
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' }, // forces pure JSON — no markdown fences
        messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: prompt },
        ],
    })
    // const geminiRaw = result.response.text()
    const raw = completion.choices[0].message.content as string


    console.log({ raw }, 'raw LLM response');

    if (!raw) {
        throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Empty response from OpenAI.')
    }

    return parseLlmJson(raw)
}

// ─── Service ──────────────────────────────────────────────────────────────────

const talkToDb = async (query: Record<string, unknown>) => {
    const { prompt, ...restQuery } = query
    console.log({ prompt, query, restQuery }, 'Received query parameters');
    const { collection, filter, summary } = await generateQueryFromLlm(prompt as string)



    console.log({ collection, filter, summary }, 'collection, filter, summary, populate');

    const Model = resolveModel(collection)

    // Merge LLM filter into QueryBuilder via .find() as the base query,
    // then let QueryBuilder handle sort / paginate / fieldFiltering from req.query
    const talkToDbQuery = new QueryBuilder(Model.find(filter), restQuery)
        .sortQuery()
        .paginateQuery()
        .fieldFilteringQuery()

    const populateOptions = COLLECTION_POPULATE_MAP[collection]
    if (populateOptions) {
        talkToDbQuery.populateQuery(populateOptions)
    }

    const [data, total] = await Promise.all([
        talkToDbQuery.queryModel.lean().exec(),
        Model.countDocuments(filter),
    ])

    return {
        collection,
        summary,
        data,
        total
    }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const talkToDbService = {
    talkToDb,
}