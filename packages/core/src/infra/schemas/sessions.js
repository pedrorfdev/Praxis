"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionsRelations = exports.sessions = exports.sessionStatusEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
const patients_1 = require("./patients");
const clinics_1 = require("./clinics");
exports.sessionStatusEnum = (0, pg_core_1.pgEnum)("session_status", ["scheduled", "completed", "cancelled"]);
exports.sessions = (0, pg_core_1.pgTable)("sessions", {
    id: (0, pg_core_1.uuid)().primaryKey().defaultRandom(),
    clinicId: (0, pg_core_1.uuid)().references(() => clinics_1.clinics.id, { onDelete: 'cascade' }).notNull(),
    patientId: (0, pg_core_1.uuid)().references(() => patients_1.patients.id, { onDelete: 'cascade' }).notNull(),
    scheduledAt: (0, pg_core_1.timestamp)().notNull(),
    content: (0, pg_core_1.text)(),
    status: (0, exports.sessionStatusEnum)().default("scheduled").notNull(),
    createdAt: (0, pg_core_1.timestamp)().defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)().defaultNow().notNull(),
});
exports.sessionsRelations = (0, drizzle_orm_1.relations)(exports.sessions, ({ one }) => ({
    clinic: one(clinics_1.clinics, {
        fields: [exports.sessions.clinicId],
        references: [clinics_1.clinics.id],
    }),
    patient: one(patients_1.patients, {
        fields: [exports.sessions.patientId],
        references: [patients_1.patients.id],
    }),
}));
//# sourceMappingURL=sessions.js.map