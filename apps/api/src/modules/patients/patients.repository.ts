import { Injectable } from '@nestjs/common'
import type {
  CreatePatientInput,
  UpdatePatientInput,
} from '@praxis/core/domain'
import { db, schema } from '@praxis/core/infra'
import { and, desc, eq } from 'drizzle-orm'

@Injectable()
export class PatientsRepository {
  private normalizeOptionalFields<T extends { cpf?: string | null; email?: string | null }>(data: T): T {
    const normalized: { cpf?: string | null; email?: string | null } & Record<string, unknown> = { ...data }

    if (Object.prototype.hasOwnProperty.call(normalized, 'cpf')) {
      normalized.cpf = normalized.cpf?.trim() ? normalized.cpf : null
    }

    if (Object.prototype.hasOwnProperty.call(normalized, 'email')) {
      normalized.email = normalized.email?.trim() ? normalized.email : null
    }

    return normalized as T
  }

  async create(data: CreatePatientInput & { clinicId: string }) {
    const [patient] = await db
      .insert(schema.patients)
      .values(this.normalizeOptionalFields(data))
      .returning()
    
    return patient
  }

  async findAllByClinic(clinicId: string) {
    return db.query.patients.findMany({
      where: eq(schema.patients.clinicId, clinicId),
      orderBy: [desc(schema.patients.createdAt)],
    })
  }

  async findById(id: string, clinicId: string) {
    return db.query.patients.findFirst({
      where: and(
        eq(schema.patients.id, id),
        eq(schema.patients.clinicId, clinicId),
      ),
    })
  }

  async update(id: string, clinicId: string, data: UpdatePatientInput) {
    const [updatedPatient] = await db
      .update(schema.patients)
      .set({ ...this.normalizeOptionalFields(data), updatedAt: new Date() })
      .where(
        and(eq(schema.patients.id, id), eq(schema.patients.clinicId, clinicId)),
      )
      .returning()
    return updatedPatient
  }

  async delete(id: string, clinicId: string) {
    await db
      .delete(schema.patients)
      .where(
        and(eq(schema.patients.id, id), eq(schema.patients.clinicId, clinicId)),
      )
  }

  async getAnamnesis(patientId: string, clinicId: string) {
    return db.query.anamnesis.findFirst({
      where: and(
        eq(schema.anamnesis.patientId, patientId),
        eq(schema.anamnesis.clinicId, clinicId),
      ),
    })
  }

  async upsertAnamnesis(patientId: string, clinicId: string, content: any) {
    const [anamnesis] = await db
      .insert(schema.anamnesis)
      .values({
        patientId,
        clinicId,
        content,
      })
      .onConflictDoUpdate({
        target: [
          schema.anamnesis.clinicId,
          schema.anamnesis.patientId,
        ],
        set: {
          content,
          updatedAt: new Date(),
        },
      })
      .returning()
    return anamnesis
  }
}
