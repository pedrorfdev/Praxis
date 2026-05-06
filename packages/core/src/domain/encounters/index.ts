import { z } from 'zod'

export const encounterStatusEnum = z.enum(['in_progress', 'completed'], {
  error: 'O status do atendimento deve ser "in_progress" ou "completed"',
})

export const billingTypeEnum = z.enum(['PRIVATE', 'SUBSIDIZED'], {
  error: 'O tipo de cobrança deve ser "PRIVATE" ou "SUBSIDIZED"',
})

export const encounterSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid(),
  patientId: z.uuid(),
  startAt: z.date(),
  durationInMinutes: z.number().int().positive('Duração deve ser um número positivo').default(60),
  sessionValueInCents: z.number().int().min(0).default(0),
  content: z.string().optional().nullable().default(''),
  status: encounterStatusEnum.default('in_progress'),
  billingType: billingTypeEnum.default('PRIVATE'),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const createEncounterSchema = encounterSchema
  .omit({
    id: true,
    clinicId: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    startAt: z.coerce.date({ message: 'Horário de início inválido' }).default(() => new Date()),
    content: z.string().optional().nullable(),
  })

export const updateEncounterSchema = createEncounterSchema.partial()

export type Encounter = z.infer<typeof encounterSchema>
export type CreateEncounterInput = z.infer<typeof createEncounterSchema>
export type UpdateEncounterInput = z.infer<typeof updateEncounterSchema>
