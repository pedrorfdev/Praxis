import { z } from 'zod';
export declare const patientSchema: z.ZodObject<{
    id: z.ZodUUID;
    clinicId: z.ZodUUID;
    fullName: z.ZodString;
    cpf: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, z.core.$strip>;
export declare const createPatientSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodNullable<z.ZodEmail>>;
    clinicId: z.ZodUUID;
    fullName: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    cpf: z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>;
}, z.core.$strip>;
export declare const updatePatientSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodEmail>>>;
    clinicId: z.ZodOptional<z.ZodUUID>;
    fullName: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    cpf: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>>>;
}, z.core.$strip>;
export type Patient = z.infer<typeof patientSchema>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
