export type TPayment = {
  amount: {
    consultationFee: number
    vat: number
    platformFee: number
    total: number
  }
  name: string
  email: string
  phone: string
  doctor: string
  patient: string
  schedule: string
  status?: string
  appointmentType?: string
  symptoms?: string
}
