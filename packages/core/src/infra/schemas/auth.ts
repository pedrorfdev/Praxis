import { pgTable, uuid, text, timestamp, index, unique, jsonb } from 'drizzle-orm/pg-core'
import { clinics } from './clinics'

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: uuid().primaryKey().defaultRandom(),
    clinicId: uuid()
      .notNull()
      .references(() => clinics.id, { onDelete: 'cascade' }),
    tokenHash: text().notNull(),
    expiresAt: timestamp().notNull(),
    usedAt: timestamp(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => ({
    clinicIdIdx: index().on(table.clinicId),
    expiresAtIdx: index().on(table.expiresAt),
    tokenHashUnique: unique().on(table.tokenHash),
  })
)
