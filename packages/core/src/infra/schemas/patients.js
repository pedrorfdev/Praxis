"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientsRelations = exports.patients = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const clinics_1 = require("./clinics");
const sessions_1 = require("./sessions");
const drizzle_orm_1 = require("drizzle-orm");
exports.patients = (0, pg_core_1.pgTable)("patients", {
    id: (0, pg_core_1.uuid)().primaryKey().defaultRandom(),
    clinicId: (0, pg_core_1.uuid)().references(() => clinics_1.clinics.id, { onDelete: 'cascade' }).notNull(),
    fullName: (0, pg_core_1.text)().notNull(),
    email: (0, pg_core_1.text)(),
    phone: (0, pg_core_1.text)(),
    cpf: (0, pg_core_1.text)(),
    createdAt: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().notNull(),
}, (table) => [
    (0, pg_core_1.uniqueIndex)("clinic_cpf_unique").on(table.clinicId, table.cpf)
]);
exports.patientsRelations = (0, drizzle_orm_1.relations)(exports.patients, ({ one, many }) => ({
    clinic: one(clinics_1.clinics, {
        fields: [exports.patients.clinicId],
        references: [clinics_1.clinics.id],
    }),
    sessions: many(sessions_1.sessions),
}));
//# sourceMappingURL=patients.js.map