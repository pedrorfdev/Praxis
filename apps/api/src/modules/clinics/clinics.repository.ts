import { Injectable } from '@nestjs/common'
import type { CreateClinicInput } from '@praxis/core/domain'
import { db, schema } from '@praxis/core/infra'
import { eq } from 'drizzle-orm'

@Injectable()
export class ClinicsRepository {
  constructor() {}

  async create(data: CreateClinicInput & { slug: string }) {
    const [result] = await db.insert(schema.clinics).values(data).returning()

    return result
  }

  async findAll() {
    return db.query.clinics.findMany()
  }

  async findById(id: string) {
    return db.query.clinics.findFirst({
      where: eq(schema.clinics.id, id),
    })
  }

  async findByEmail(email: string) {
    return db.query.clinics.findFirst({
      where: eq(schema.clinics.email, email),
    })
  }

  async update(id: string, data: any) {
    const [result] = await db
      .update(schema.clinics)
      .set(data)
      .where(eq(schema.clinics.id, id))
      .returning()
    return result
  }

  async delete(id: string) {
    await db.delete(schema.clinics).where(eq(schema.clinics.id, id)).returning()
  }
}
