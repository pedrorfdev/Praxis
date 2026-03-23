import { Injectable } from '@nestjs/common';
import type { CreateSessionInput } from '@praxis/core/domain';
import { db, schema } from '@praxis/core/infra';
import { and, desc, eq } from 'drizzle-orm';

@Injectable()
export class SessionsRepository {
  async create(data: CreateSessionInput & { clinicId: string }) {
    const [session] = await db.insert(schema.sessions).values(data).returning();

    return session;
  }

  async findAllByClinic(clinicId: string) {
    return db.query.sessions.findMany({
      where: eq(schema.sessions.clinicId, clinicId),
      with: {
        patient: {
          columns: {
            fullname: true,
          },
        },
      },
      orderBy: [desc(schema.sessions.scheduledAt)],
    });
  }

  async findById(id: string, clinicId: string) {
    return db.query.sessions.findFirst({
      where: and(
        eq(schema.sessions.id, id),
        eq(schema.sessions.clinicId, clinicId),
      ),
      with: {
        patient: true
      }
    });
  }

  async update(id: string, clinicId: string, data: any) {
    const [updatedSession] = await db
      .update(schema.sessions)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(
          eq(schema.sessions.id, id),
          eq(schema.sessions.clinicId, clinicId),
        ),
      )
      .returning();
    return updatedSession;
  }

  async updateStatus(clinicId: string, id: string, status: "scheduled" | "completed" | "cancelled") {
  const [result] = await db
    .update(schema.sessions)
    .set({ status, updatedAt: new Date() })
    .where(
      and(
        eq(schema.sessions.id, id),
        eq(schema.sessions.clinicId, clinicId)
      )
    )
    .returning();
    
  return result;
}

  async delete(id: string, clinicId: string) {
  return db
    .delete(schema.sessions)
    .where(
      and(
        eq(schema.sessions.id, id),
        eq(schema.sessions.clinicId, clinicId)
      )
    )
    .returning();
}
}
