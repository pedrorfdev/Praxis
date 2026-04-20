import { relations } from 'drizzle-orm'
import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { clinics } from './clinics'
import { patients } from './patients'

export const encounterStatusEnum = pgEnum('encounter_status', [
  'in_progress',
  'completed',
])

export const billingTypeEnum = pgEnum('billing_type', [
  'PRIVATE',
  'SUBSIDIZED',
])

export const encounters = pgTable('encounters', {
  id: uuid().primaryKey().defaultRandom(),
  clinicId: uuid()
    .references(() => clinics.id, { onDelete: 'cascade' })
    .notNull(),
  patientId: uuid()
    .references(() => patients.id, { onDelete: 'cascade' })
    .notNull(),
  startAt: timestamp().defaultNow().notNull(),
  durationInMinutes: integer().default(60).notNull(),
  billingType: billingTypeEnum().default('PRIVATE').notNull(),
  content: text(),
  status: encounterStatusEnum().default('in_progress').notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
})

export const encountersRelations = relations(encounters, ({ one }) => ({
  clinic: one(clinics, {
    fields: [encounters.clinicId],
    references: [clinics.id],
  }),
  patient: one(patients, {
    fields: [encounters.patientId],
    references: [patients.id],
  }),
}))
