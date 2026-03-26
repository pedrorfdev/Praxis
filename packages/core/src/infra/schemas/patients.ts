import { relations } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'
import { clinics } from './clinics'
import { sessions } from './sessions'

export const patients = pgTable(
  'patients',
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicId: uuid()
      .references(() => clinics.id, { onDelete: 'cascade' })
      .notNull(),
    fullName: text().notNull(),
    email: text(),
    phone: text(),
    cpf: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [uniqueIndex('clinic_cpf_unique').on(table.clinicId, table.cpf)],
)

export const patientsRelations = relations(patients, ({ one, many }) => ({
  clinic: one(clinics, {
    fields: [patients.clinicId],
    references: [clinics.id],
  }),
  sessions: many(sessions),
}))
