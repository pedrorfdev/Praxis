import { relations } from 'drizzle-orm'
import { boolean, pgTable, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { caregivers } from './caregivers'
import { clinics } from './clinics'
import { patients } from './patients'

export const patientCaregivers = pgTable(
  'patient_caregivers',
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicId: uuid()
      .references(() => clinics.id, { onDelete: 'cascade' })
      .notNull(),
    patientId: uuid()
      .references(() => patients.id, { onDelete: 'cascade' })
      .notNull(),
    caregiverId: uuid()
      .references(() => caregivers.id, { onDelete: 'cascade' })
      .notNull(),
    isPrimary: boolean().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('patient_caregiver_unique').on(
      table.clinicId,
      table.patientId,
      table.caregiverId,
    ),
  ],
)

export const patientCaregiversRelations = relations(patientCaregivers, ({ one }) => ({
  clinic: one(clinics, {
    fields: [patientCaregivers.clinicId],
    references: [clinics.id],
  }),
  patient: one(patients, {
    fields: [patientCaregivers.patientId],
    references: [patients.id],
  }),
  caregiver: one(caregivers, {
    fields: [patientCaregivers.caregiverId],
    references: [caregivers.id],
  }),
}))
