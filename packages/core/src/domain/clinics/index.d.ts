import { z } from 'zod';
export declare const clinicSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    slug: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const createClinicSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
    slug: z.ZodString;
}, z.core.$strip>;
export declare const updateClinicSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodEmail>;
    password: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export type Clinic = z.infer<typeof clinicSchema>;
export type CreateClinicInput = z.infer<typeof createClinicSchema>;
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
