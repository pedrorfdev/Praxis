import { relations } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

import { clinics } from './clinics'
import { encounters } from './encounters'
import { patientCaregivers } from './patient-caregivers'

export const patientTypeEnum = pgEnum('patient_type', ['ADULT', 'CHILD'])

export const diagnosisEnum = pgEnum('diagnosis', [
  'TDAH',
  'TEA',
  'DEPRESSAO',
  'ANSIEDADE',
  'BIPOLAR',
  'ESQUIZOFRENIA',
  'TOC',
  'PTSD',
  'AUTISMO',
  'SINDROME_DOWN',
  'DEFICIENCIA_INTELECTUAL',
  'PARALISIA_CEREBRAL',
  'DISTURBIO_APRENDIZAGEM',
  'GAGUEZ',
  'AFASIA',
  'DYSPRAXIA',
  'OUTRO',
])

export const patients = pgTable('patients', {
  id: uuid().primaryKey().defaultRandom(),
  clinicId: uuid().references(() => clinics.id, { onDelete: 'cascade' }).notNull(),
  type: patientTypeEnum().notNull(),
  fullName: text().notNull(),
  birthDate: timestamp().notNull(),
  gender: text().notNull(),
  address: text().notNull(),
  city: text().notNull(),
  phone: text(),
  diagnosis: diagnosisEnum(),
  cpf: text(),
  
  responsibleName: text(), 
  responsiblePhone: text(),

  birthPlace: text().notNull(),
  maritalStatus: text().notNull(),
  educationLevel: text().notNull(),
  profession: text().notNull(),
  religion: text().notNull(),
  isActive: boolean().default(true).notNull(),

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
  encounters: many(encounters),
  caregiverLinks: many(patientCaregivers),
}))
