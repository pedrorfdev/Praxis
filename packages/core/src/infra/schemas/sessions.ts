import { pgTable, text, timestamp, uuid, pgEnum } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { patients } from "./patients";
import { clinics } from "./clinics";

export const sessionStatusEnum = pgEnum("session_status", ["scheduled", "completed", "cancelled"]);

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  clinicId: uuid().references(() => clinics.id, { onDelete: 'cascade' }).notNull(),
  patientId: uuid().references(() => patients.id, { onDelete: 'cascade' }).notNull(),
  scheduledAt: timestamp().notNull(),
  content: text(),
  status: sessionStatusEnum().default("scheduled").notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  clinic: one(clinics, {
    fields: [sessions.clinicId],
    references: [clinics.id],
  }),
  patient: one(patients, {
    fields: [sessions.patientId],
    references: [patients.id],
  }),
}));