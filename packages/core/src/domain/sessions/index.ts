import { z } from 'zod';

export const sessionSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid(),
  patientId: z.uuid(),
  scheduledAt: z.date(),
  content: z.string().optional().default(""),
  status: z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createSessionSchema = sessionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  scheduledAt: z.coerce.date({ message: "Data de agendamento inválida" }),
});

export const updateSessionSchema = createSessionSchema.partial();

export type Session = z.infer<typeof sessionSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
