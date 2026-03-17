import { Inject, Injectable } from "@nestjs/common";
import { DRIZZLE } from '../../infra/database/database.module'
import { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { schema } from "@praxis/core/infra";

@Injectable()
export class ClinicsRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>
  ){}

  async create(data: any) {
    const [result] = await this.db
      .insert(schema.clinics)
      .values(data)
      .returning()

    return result
  }

  async findAll(){
    return this.db.query.clinics.findMany()
  }
}