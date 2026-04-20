import { z } from "zod";

const validateCpf = (cpf: string) => {
  const cleanCpf = cpf.replace(/\D/g, "");
  if (cleanCpf.length !== 11 || !!cleanCpf.match(/(\d)\1{10}/)) return false;
  const digits = cleanCpf.split("").map(Number);
  const calcDigit = (slice: number[]) => {
    const sum = slice.reduce(
      (acc, curr, i) => acc + curr * (slice.length + 1 - i),
      0,
    );
    const result = (sum * 10) % 11;
    return result === 10 ? 0 : result;
  };
  return (
    calcDigit(digits.slice(0, 9)) === digits[9] &&
    calcDigit(digits.slice(0, 10)) === digits[10]
  );
};

// Common diagnoses used in clinical practice
export const diagnosisEnum = z.enum(
  [
    'TDAH',
    'TEA',
    'DEPRESSAO',
    'ANSIEDADE',
    'BIPOLAR',
    'ESQUIZOFRENIA',
    'TOC',
    'PTSD',
    'AUTISMO',
    'SINDROME_DOWN',
    'DEFICIENCIA_INTELECTUAL',
    'PARALISIA_CEREBRAL',
    'DISTURBIO_APRENDIZAGEM',
    'GAGUEZ',
    'AFASIA',
    'DYSPRAXIA',
    'OUTRO'
  ],
  {
    error: 'Diagnóstico inválido',
  },
);

export const patientSchema = z.object({
  id: z.uuid(),
  clinicId: z.uuid(),
  type: z.enum(["ADULT", "CHILD"], {
    error: "O tipo do paciente deve ser 'ADULT' ou 'CHILD'"
  }),
  fullName: z
    .string()
    .min(3, "O nome do paciente deve ter no mínimo 3 caracteres")
    .max(120, "Nome muito longo")
    .trim(),
  birthDate: z.coerce.date({
    error: "Data de nascimento é obrigatória"
  }),
  gender: z.string().min(1, "Gênero é obrigatório").trim(),
  phone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos")
    .nullable()
    .optional(),
  
  address: z
    .string()
    .min(5, "Endereço muito curto")
    .max(200, "Endereço muito longo")
    .trim(),
  city: z
    .string()
    .min(2, "Cidade muito curta")
    .max(50, "Cidade muito longa")
    .trim(),

  responsibleName: z
    .string()
    .min(3, "Nome do responsável inválido")
    .max(120, "Nome muito longo")
    .trim()
    .nullable()
    .optional(),
  responsiblePhone: z
    .string()
    .regex(/^\d{10,11}$/, "Telefone deve ter 10 ou 11 dígitos")
    .nullable()
    .optional(),

  cpf: z
    .string()
    .transform((v) => v?.replace(/\D/g, ""))
    .refine((v) => !v || validateCpf(v), { message: "CPF inválido" })
    .nullable()
    .optional(),

  birthPlace: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .max(100, "Muito longo")
    .trim(),
  maritalStatus: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .trim(),
  educationLevel: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .trim(),
  profession: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .max(100, "Profissão muito longa")
    .trim(),
  religion: z
    .string()
    .min(1, "Esse campo é obrigatório")
    .trim(),
  diagnosis: diagnosisEnum.nullable().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});


const basePatientSchema = patientSchema.omit({ 
  id: true,
  clinicId: true,
  createdAt: true, 
  updatedAt: true 
});

  export const createPatientSchema = basePatientSchema
  .superRefine((data, ctx) => {
    if (data.type === 'CHILD') {
      if (!data.responsibleName || data.responsibleName.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Nome do responsável é obrigatório para crianças",
          path: ["responsibleName"],
        });
      }
      if (!data.responsiblePhone || data.responsiblePhone.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Telefone do responsável é obrigatório",
          path: ["responsiblePhone"],
        });
      }
    }

    if (data.type === 'ADULT') {
      const fields = ['profession', 'maritalStatus', 'educationLevel', 'cpf'] as const;
      fields.forEach((field) => {
        if (!data[field] || data[field]!.length < 1) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo é obrigatório para adultos",
            path: [field],
          });
        }
      });
    }
  });

export const updatePatientSchema = basePatientSchema.partial();

export const updatePatientDiagnosisSchema = z.object({
  diagnosis: diagnosisEnum.nullable().optional(),
});

export type Patient = z.infer<typeof patientSchema>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type UpdatePatientDiagnosisInput = z.infer<typeof updatePatientDiagnosisSchema>;