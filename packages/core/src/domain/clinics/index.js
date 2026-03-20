"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.updateClinicSchema = exports.createClinicSchema = exports.clinicSchema = void 0;
const zod_1 = require("zod");
exports.clinicSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    name: zod_1.z.string()
        .min(3, "O nome da clínica deve ter no mínimo 3 caracteres")
        .max(100, "Nome muito longo"),
    email: zod_1.z.email("E-mail inválido").toLowerCase(),
    password: zod_1.z.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres"),
    slug: zod_1.z.string()
        .min(3, "O slug deve ter no mínimo 3 caracteres")
        .regex(/^[a-z0-9-]+$/, "O slug deve conter apenas letras minúsculas, números e hífens"),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.createClinicSchema = exports.clinicSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.updateClinicSchema = exports.createClinicSchema.partial();
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("E-mail inválido"),
    password: zod_1.z.string().min(1, "Senha é obrigatória"),
});
//# sourceMappingURL=index.js.map