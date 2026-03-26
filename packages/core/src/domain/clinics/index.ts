import { z } from 'zod'

export const clinicSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(3, 'O nome da clínica deve ter no mínimo 3 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.email('E-mail inválido').toLowerCase(),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  slug: z
    .string()
    .min(3, 'O slug deve ter no mínimo 3 caracteres')
    .regex(
      /^[a-z0-9-]+$/,
      'O slug deve conter apenas letras minúsculas, números e hífens',
    ),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createClinicSchema = clinicSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
})

export const updateClinicSchema = createClinicSchema.partial()

export const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type Clinic = z.infer<typeof clinicSchema>
export type CreateClinicInput = z.infer<typeof createClinicSchema>
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>
export type LoginInput = z.infer<typeof loginSchema>
