import { index, jsonb, pgTable, timestamp, unique, uuid } from "drizzle-orm/pg-core";
import { clinics } from "./clinics";
import { patients } from "./patients";

export const anamnesis = pgTable(
  'anamnesis',
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicId: uuid()
      .notNull()
      .references(() => clinics.id, { onDelete: 'cascade' }),
    patientId: uuid()
      .notNull()
      .references(() => patients.id, { onDelete: 'cascade' }),
    content: jsonb().notNull().default({}),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    clinicIdIdx: index().on(table.clinicId),
    patientIdIdx: index().on(table.patientId),
    patientUnique: unique().on(table.patientId),
  })
)