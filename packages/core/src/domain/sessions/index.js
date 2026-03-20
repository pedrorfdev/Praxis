"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSessionSchema = exports.createSessionSchema = exports.sessionSchema = void 0;
const zod_1 = require("zod");
exports.sessionSchema = zod_1.z.object({
    id: zod_1.z.uuid(),
    clinicId: zod_1.z.uuid(),
    patientId: zod_1.z.uuid(),
    scheduledAt: zod_1.z.date(),
    content: zod_1.z.string().optional().default(""),
    status: zod_1.z.enum(["scheduled", "completed", "cancelled"]).default("scheduled"),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
exports.createSessionSchema = exports.sessionSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
}).extend({
    scheduledAt: zod_1.z.coerce.date({ message: "Data de agendamento inválida" }),
});
exports.updateSessionSchema = exports.createSessionSchema.partial();
//# sourceMappingURL=index.js.map