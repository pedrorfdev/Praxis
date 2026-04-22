import { z } from 'zod'

export const anamnesisContentSchema = z.record(z.string(),z.any()).default({})

export const anamnesisSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid(),
  patientId: z.uuid(),
  content: anamnesisContentSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createAnamnesisSchema = anamnesisSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateAnamnesisSchema = z.object({
  content: anamnesisContentSchema,
})

export type Anamnesis = z.infer<typeof anamnesisSchema>
export type AnamnesisContent = z.infer<typeof anamnesisContentSchema>
export type CreateAnamnesisInput = z.infer<typeof createAnamnesisSchema>
export type UpdateAnamnesisInput = z.infer<typeof updateAnamnesisSchema>
