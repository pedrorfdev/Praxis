import { Injectable } from '@nestjs/common'
import { db, schema } from '@praxis/core/infra'
import { eq, and, isNull, lt } from 'drizzle-orm'

@Injectable()
export class PasswordResetTokenRepository {
  constructor() {}

  async create(clinicId: string, tokenHash: string, expiresAt: Date) {
    const [result] = await db
      .insert(schema.passwordResetTokens)
      .values({
        clinicId,
        tokenHash,
        expiresAt,
      })
      .returning()

    return result
  }

  async findByTokenHash(tokenHash: string) {
    return db.query.passwordResetTokens.findFirst({
      where: eq(schema.passwordResetTokens.tokenHash, tokenHash),
    })
  }

  async markAsUsed(id: string) {
    const [result] = await db
      .update(schema.passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(eq(schema.passwordResetTokens.id, id))
      .returning()

    return result
  }

  async deleteExpiredTokens() {
    await db
      .delete(schema.passwordResetTokens)
      .where(
        and(
          isNull(schema.passwordResetTokens.usedAt),
          lt(schema.passwordResetTokens.expiresAt, new Date())
        )
      )
  }
}
