import { DRIZZLE } from '../../infra/database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { schema } from '@praxis/core/infra';
import type { CreateClinicInput } from '@praxis/core/domain';

@Injectable()
export class ClinicsRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(data: CreateClinicInput) {
    const [result] = await this.db
      .insert(schema.clinics)
      .values(data)
      .returning();

    return result;
  }

  async findAll() {
    return this.db.query.clinics.findMany();
  }

  async findById(id: string) {
    return this.db.query.clinics.findFirst({
      where: eq(schema.clinics.id, id),
    });
  }

  async findByEmail(email: string) {
    return this.db.query.clinics.findFirst({
      where: eq(schema.clinics.email, email),
    });
  }

  async update(id: string, data: any) {
    const [result] = await this.db
      .update(schema.clinics)
      .set(data)
      .where(eq(schema.clinics.id, id))
      .returning();
    return result;
  }

  async delete(id: string) {
    await this.db
      .delete(schema.clinics)
      .where(eq(schema.clinics.id, id))
      .returning();
  }
}
