"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePatientSchema = exports.createPatientSchema = exports.patientSchema = void 0;
const zod_1 = require("zod");
const validateCPF = (cpf) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11 || !!cleanCPF.match(/(\d)\1{10}/))
        return false;
    const digits = cleanCPF.split('').map(Number);
    const calcDigit = (slice) => {
        const sum = slice.reduce((acc, curr, i) => acc + curr * (slice.length + 1 - i), 0);
        const result = (sum * 10) % 11;
        return result === 10 ? 0 : result;
    };
    return calcDigit(digits.slice(0, 9)) === digits[9] &&
        calcDigit(digits.slice(0, 10)) === digits[10];
};
exports.patientSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    clinicId: zod_1.z.uuid(),
    fullName: zod_1.z.string()
        .min(3, "O nome do paciente deve ter no mínimo 3 caracteres")
        .max(120, "Nome muito longo"),
    cpf: zod_1.z.string()
        .transform(v => v?.replace(/\D/g, ''))
        .refine(v => !v || validateCPF(v), { message: "CPF inválido" })
        .nullable()
        .optional(),
    email: zod_1.z.email("E-mail inválido").nullable().optional(),
    phone: zod_1.z.string().min(10, "Telefone incompleto").nullable().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.createPatientSchema = exports.patientSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.updatePatientSchema = exports.createPatientSchema.partial();
//# sourceMappingURL=index.js.map