import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { createSessionSchema, updateSessionSchema } from '@praxis/core/domain';

@Injectable()
export class SessionsService {
  constructor(private readonly repository: SessionsRepository) {}

  async create(data: any, clinicId: string) {
    const validatedData = createSessionSchema.parse(data);
    return this.repository.create({ ...validatedData, clinicId });
  }

  async findAll(clinicId: string) {
    return this.repository.findAllByClinic(clinicId);
  }

  async findOne(id: string, clinicId: string) {
    const session = await this.repository.findById(id, clinicId);
    if (!session) throw new NotFoundException('Sessão não encontrada');
    return session;
  }

  async update(id: string, clinicId: string, data: any) {
    const validatedData = updateSessionSchema.parse(data);
    const updated = await this.repository.update(id, clinicId, validatedData);
    if (!updated)
      throw new NotFoundException('Sessão não encontrada');
    return updated;
  }

  async remove(id: string, clinicId: string) {
    const session = await this.findOne(id, clinicId);

    if (session.status === 'completed') {
      throw new BadRequestException(
        'Não é possível deletar uma sessão já finalizada. Tente cancelar ou editar.',
      );
    }

    return this.repository.delete(id, clinicId);
  }
}
