import { Injectable } from '@nestjs/common'
import type { CreateEncounterInput, UpdateEncounterInput } from '@praxis/core/domain'
import { db, schema } from '@praxis/core/infra'
import { and, desc, eq } from 'drizzle-orm'

@Injectable()
export class EncountersRepository {
  async create(data: CreateEncounterInput & { clinicId: string }) {
    const [encounter] = await db.insert(schema.encounters).values(data).returning()

    return encounter
  }

  async findAllByClinic(clinicId: string) {
    return db.query.encounters.findMany({
      where: eq(schema.encounters.clinicId, clinicId),
      with: {
        patient: {
          columns: {
            fullName: true,
          },
        },
      },
      orderBy: [desc(schema.encounters.startAt)],
    })
  }

  async findById(id: string, clinicId: string) {
    return db.query.encounters.findFirst({
      where: and(
        eq(schema.encounters.id, id),
        eq(schema.encounters.clinicId, clinicId),
      ),
      with: {
        patient: true,
      },
    })
  }

  async update(id: string, clinicId: string, data: UpdateEncounterInput) {
    const [updatedEncounter] = await db
      .update(schema.encounters)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(schema.encounters.id, id), eq(schema.encounters.clinicId, clinicId)),
      )
      .returning()
    return updatedEncounter
  }

  async updateStatus(
    clinicId: string,
    encounterId: string,
    status: 'in_progress' | 'completed',
  ) {
    const [updated] = await db
      .update(schema.encounters)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(schema.encounters.id, encounterId),
          eq(schema.encounters.clinicId, clinicId),
        ),
      )
      .returning()

    return updated
  }

  async delete(id: string, clinicId: string) {
    return db
      .delete(schema.encounters)
      .where(
        and(eq(schema.encounters.id, id), eq(schema.encounters.clinicId, clinicId)),
      )
  }
}
