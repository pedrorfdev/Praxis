import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { clinics } from './clinics'
import { patientCaregivers } from './patient-caregivers'

export const caregivers = pgTable(
  'caregivers',
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicId: uuid()
      .references(() => clinics.id, { onDelete: 'cascade' })
      .notNull(),
    name: text().notNull(),
    document: text().notNull(),
    phone: text().notNull(),
    email: text(),
    zipCode: text(),
    address: text(),
    isActive: boolean().default(true).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [uniqueIndex('clinic_caregiver_document_unique').on(table.clinicId, table.document)],
)

export const caregiversRelations = relations(caregivers, ({ one, many }) => ({
  clinic: one(clinics, {
    fields: [caregivers.clinicId],
    references: [clinics.id],
  }),
  patientLinks: many(patientCaregivers),
}))
