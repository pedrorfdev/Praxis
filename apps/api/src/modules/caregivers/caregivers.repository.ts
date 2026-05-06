import { Injectable } from '@nestjs/common'
import type {
  CreateCaregiverInput,
  UpdateCaregiverInput,
} from '@praxis/core/domain'
import { db, schema } from '@praxis/core/infra'
import { and, desc, eq } from 'drizzle-orm'

@Injectable()
export class CaregiversRepository {
  async create(data: CreateCaregiverInput & { clinicId: string }) {
    const [caregiver] = await db
      .insert(schema.caregivers)
      .values(data)
      .returning()
    
    return caregiver
  }

  async findAllByClinic(clinicId: string) {
    return db.query.caregivers.findMany({
      where: eq(schema.caregivers.clinicId, clinicId),
      with: {
        patientLinks: true,
      },
      orderBy: [desc(schema.caregivers.createdAt)],
    })
  }

  async findById(id: string, clinicId: string) {
    return db.query.caregivers.findFirst({
      where: and(
        eq(schema.caregivers.id, id),
        eq(schema.caregivers.clinicId, clinicId),
      ),
      with: {
        patientLinks: {
          with: {
            patient: true,
          },
        },
      },
    })
  }

  async update(id: string, clinicId: string, data: UpdateCaregiverInput) {
    const [updatedCaregiver] = await db
      .update(schema.caregivers)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(schema.caregivers.id, id), eq(schema.caregivers.clinicId, clinicId)),
      )
      .returning()
    return updatedCaregiver
  }

  async delete(id: string, clinicId: string) {
    await db
      .delete(schema.caregivers)
      .where(
        and(eq(schema.caregivers.id, id), eq(schema.caregivers.clinicId, clinicId)),
      )
  }

  async linkToPatient(patientId: string, caregiverId: string, clinicId: string, isPrimary: boolean) {
    const existingLink = await db.query.patientCaregivers.findFirst({
      where: and(
        eq(schema.patientCaregivers.clinicId, clinicId),
        eq(schema.patientCaregivers.patientId, patientId),
        eq(schema.patientCaregivers.caregiverId, caregiverId),
      ),
    })

    if (existingLink) {
      const [updatedLink] = await db
        .update(schema.patientCaregivers)
        .set({ isPrimary, updatedAt: new Date() })
        .where(eq(schema.patientCaregivers.id, existingLink.id))
        .returning()
      return updatedLink
    }

    const [createdLink] = await db
      .insert(schema.patientCaregivers)
      .values({
        patientId,
        caregiverId,
        clinicId,
        isPrimary,
      })
      .returning()
    return createdLink
  }

  async unlinkFromPatient(patientId: string, caregiverId: string, clinicId: string) {
    await db
      .delete(schema.patientCaregivers)
      .where(
        and(
          eq(schema.patientCaregivers.patientId, patientId),
          eq(schema.patientCaregivers.caregiverId, caregiverId),
          eq(schema.patientCaregivers.clinicId, clinicId),
        ),
      )
  }

  async findByPatient(patientId: string, clinicId: string) {
    return db.query.patientCaregivers.findMany({
      where: and(
        eq(schema.patientCaregivers.patientId, patientId),
        eq(schema.patientCaregivers.clinicId, clinicId),
      ),
      with: {
        caregiver: true,
      },
    })
  }
}
