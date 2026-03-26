import { z } from 'zod'

const validateCpf = (cpf: string) => {
  const cleanCpf = cpf.replace(/\D/g, '')
  if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false
  const digits = cleanCpf.split('').map(Number)
  const calcDigit = (slice: number[]) => {
    const sum = slice.reduce(
      (acc, curr, i) => acc + curr * (slice.length + 1 - i),
      0,
    )
    const result = (sum * 10) % 11
    return result === 10 ? 0 : result
  }
  return (
    calcDigit(digits.slice(0, 9)) === digits[9] &&
    calcDigit(digits.slice(0, 10)) === digits[10]
  )
}

export const patientSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid(),
  fullName: z
    .string()
    .min(3, 'O nome do paciente deve ter no mínimo 3 caracteres')
    .max(120, 'Nome muito longo'),
  cpf: z
    .string()
    .transform((v) => v?.replace(/\D/g, ''))
    .refine((v) => !v || validateCpf(v), { message: 'CPF inválido' })
    .nullable()
    .optional(),
  email: z.email('E-mail inválido').nullable().optional(),
  phone: z.string().min(10, 'Telefone incompleto').nullable().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createPatientSchema = patientSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updatePatientSchema = createPatientSchema.partial()

export type Patient = z.infer<typeof patientSchema>
export type CreatePatientInput = z.infer<typeof createPatientSchema>
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>
