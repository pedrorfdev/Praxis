import { z } from 'zod'

export const caregiverSchema = z.object({
  id: z.string().uuid(),
  clinicId: z.string().uuid(),
  name: z.string().min(3).max(120),
  document: z.string().min(11), // CPF ou RG
  phone: z.string().min(10),
  email: z.string().email().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createCaregiverSchema = caregiverSchema.omit({
  id: true,
  clinicId: true,
  createdAt: true,
  updatedAt: true,
})

export const updateCaregiverSchema = createCaregiverSchema.partial()

export const linkCaregiverSchema = z.object({
  caregiverId: z.string().uuid(),
  isPrimary: z.boolean().default(false),
})

export type Caregiver = z.infer<typeof caregiverSchema>
export type CreateCaregiverInput = z.infer<typeof createCaregiverSchema>
export type UpdateCaregiverInput = z.infer<typeof updateCaregiverSchema>
export type LinkCaregiverInput = z.infer<typeof linkCaregiverSchema>
