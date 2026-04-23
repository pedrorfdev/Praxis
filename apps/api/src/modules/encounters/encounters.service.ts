import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { EncountersRepository } from './encounters.repository'
import type { CreateEncounterInput, UpdateEncounterInput } from '@praxis/core/domain'

@Injectable()
export class EncountersService {
  private readonly logger = new Logger(EncountersService.name)

  constructor(
    @Inject(EncountersRepository)
    private readonly repository: EncountersRepository
  ) {}

  async create(data: CreateEncounterInput, clinicId: string) {
    try {
      return await this.repository.create({ ...data, clinicId })
    } catch (error: any) {
      this.logger.error(`Erro ao criar atendimento: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao tentar registrar o atendimento.')
    }
  }

  async findAll(clinicId: string) {
    try {
      return await this.repository.findAllByClinic(clinicId)
    } catch (error: any) {
      this.logger.error(`Erro ao listar atendimentos: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao buscar a lista de atendimentos.')
    }
  }

  async findOne(id: string, clinicId: string) {
    try {
      const encounter = await this.repository.findById(id, clinicId)
      if (!encounter)
        throw new NotFoundException('Atendimento não encontrado para esta clínica')
      return encounter
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error
      this.logger.error(`Erro ao buscar atendimento: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao recuperar o atendimento.')
    }
  }

  async update(id: string, clinicId: string, data: UpdateEncounterInput) {
    await this.findOne(id, clinicId)

    try {
      return await this.repository.update(id, clinicId, data)
    } catch (error: any) {
      this.logger.error(`Erro ao atualizar atendimento: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao atualizar o atendimento.')
    }
  }

  async updateStatus(clinicId: string, encounterId: string, status: any) {
    try {
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
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error
      this.logger.error(`Erro ao atualizar status: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao atualizar o status do atendimento.')
    }
  }

  async delete(id: string, clinicId: string) {
    const encounter = await this.findOne(id, clinicId)

    if (encounter.status === 'completed') {
      throw new BadRequestException(
        'Não é possível deletar um atendimento já finalizado.',
      )
    }

    try {
      await this.repository.delete(id, clinicId)
      return { message: 'Atendimento removido com sucesso' }
    } catch (error: any) {
      this.logger.error(`Erro ao remover atendimento: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao remover o atendimento.')
    }
  }
}
