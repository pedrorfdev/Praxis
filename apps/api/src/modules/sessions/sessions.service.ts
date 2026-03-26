import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { SessionsRepository } from './sessions.repository'

@Injectable()
export class SessionsService {
  constructor(
    @Inject(SessionsRepository)
    private readonly repository: SessionsRepository
  ) {}

  async create(data: any, clinicId: string) {
    return this.repository.create({ ...data, clinicId })
  }

  async findAll(clinicId: string) {
    return this.repository.findAllByClinic(clinicId)
  }

  async findOne(id: string, clinicId: string) {
    const session = await this.repository.findById(id, clinicId)
    if (!session)
      throw new NotFoundException('Sessão não encontrada para esta clínica')
    return session
  }

  async update(id: string, clinicId: string, data: any) {
    await this.findOne(id, clinicId)

    const updated = await this.repository.update(id, clinicId, data)
    return updated
  }

  async updateStatus(clinicId: string, sessionId: string, status: any) {
    const updated = await this.repository.updateStatus(
      clinicId,
      sessionId,
      status,
    )

    if (!updated) {
      throw new NotFoundException(
        'Sessão não encontrada ou não pertence a esta clínica',
      )
    }

    return updated
  }

  async remove(id: string, clinicId: string) {
    const session = await this.findOne(id, clinicId)

    if (session.status === 'completed') {
      throw new BadRequestException(
        'Não é possível deletar uma sessão já finalizada. Tente cancelar ou editar.',
      )
    }

    await this.repository.delete(id, clinicId)
    return { message: 'Sessão removida com sucesso' }
  }
}
