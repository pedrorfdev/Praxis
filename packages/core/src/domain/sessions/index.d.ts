import { z } from 'zod';
export declare const sessionSchema: z.ZodObject<{
    id: z.ZodUUID;
    clinicId: z.ZodUUID;
    patientId: z.ZodUUID;
    scheduledAt: z.ZodDate;
    content: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        scheduled: "scheduled";
        completed: "completed";
        cancelled: "cancelled";
    }>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const createSessionSchema: z.ZodObject<{
    clinicId: z.ZodUUID;
    patientId: z.ZodUUID;
    content: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        scheduled: "scheduled";
        completed: "completed";
        cancelled: "cancelled";
    }>>;
    scheduledAt: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export declare const updateSessionSchema: z.ZodObject<{
    clinicId: z.ZodOptional<z.ZodUUID>;
    patientId: z.ZodOptional<z.ZodUUID>;
    content: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        scheduled: "scheduled";
        completed: "completed";
        cancelled: "cancelled";
    }>>>;
    scheduledAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type Session = z.infer<typeof sessionSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
