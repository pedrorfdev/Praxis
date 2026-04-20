import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { EncountersRepository } from './encounters.repository'
import type { CreateEncounterInput, UpdateEncounterInput } from '@praxis/core/domain'

@Injectable()
export class EncountersService {
  constructor(
    @Inject(EncountersRepository)
    private readonly repository: EncountersRepository
  ) {}

  async create(data: CreateEncounterInput, clinicId: string) {
    return this.repository.create({ ...data, clinicId })
  }

  async findAll(clinicId: string) {
    return this.repository.findAllByClinic(clinicId)
  }

  async findOne(id: string, clinicId: string) {
    const encounter = await this.repository.findById(id, clinicId)
    if (!encounter)
      throw new NotFoundException('Atendimento não encontrado para esta clínica')
    return encounter
  }

  async update(id: string, clinicId: string, data: UpdateEncounterInput) {
    await this.findOne(id, clinicId)

    const updated = await this.repository.update(id, clinicId, data)
    return updated
  }

  async updateStatus(clinicId: string, encounterId: string, status: any) {
    const updated = await this.repository.updateStatus(
      clinicId,
      encounterId,
      status,
    )

    if (!updated) {
      throw new NotFoundException(
        'Atendimento não encontrado ou não pertence a esta clínica',
      )
    }

    return updated
  }

  async delete(id: string, clinicId: string) {
    const encounter = await this.findOne(id, clinicId)

    if (encounter.status === 'completed') {
      throw new BadRequestException(
        'Não é possível deletar um atendimento já finalizado.',
      )
    }

    await this.repository.delete(id, clinicId)
    return { message: 'Atendimento removido com sucesso' }
  }
}
