import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid(),
  patientId: z.uuid(),
  scheduledAt: z.date(),
  content: z.string().nullable().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSessionSchema = sessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  scheduledAt: z.date().refine(date => date >= new Date(), {
    message: "A sessão não pode ser agendada para o passado",
  }),
});

export const updateSessionSchema = createSessionSchema.partial();

export type Session = z.infer<typeof sessionSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;