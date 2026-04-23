import { Inject, Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common'
import { PatientsRepository } from './patients.repository'
import type { UpdatePatientInput, UpdatePatientDiagnosisInput } from '@praxis/core/domain'

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name)

  constructor(
    @Inject(PatientsRepository)
    private readonly repository: PatientsRepository
  ) {}

  async create(data: any, clinicId: string) {
    try {
      return await this.repository.create({ ...data, clinicId })
    } catch (error: any) {
      this.logger.error(`Erro ao criar paciente: ${error.message}`, error.stack)
      // Tratamento para violação de chave única (ex: CPF duplicado)
      if (error.code === '23505') {
        throw new BadRequestException('Já existe um paciente com este CPF nesta clínica.')
      }
      throw new InternalServerErrorException('Erro interno ao tentar cadastrar o paciente.')
    }
  }

  async findAll(clinicId: string) {
    try {
      return await this.repository.findAllByClinic(clinicId)
    } catch (error: any) {
      this.logger.error(`Erro ao buscar pacientes: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao buscar a lista de pacientes.')
    }
  }

  async findOne(id: string, clinicId: string) {
    try {
      const patient = await this.repository.findById(id, clinicId)
      if (!patient)
        throw new NotFoundException('Paciente não encontrado nesta clínica')
      return patient
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error
      this.logger.error(`Erro ao buscar paciente: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao buscar as informações do paciente.')
    }
  }

  async update(id: string, clinicId: string, data: UpdatePatientInput) {
    await this.findOne(id, clinicId)
    
    try {
      return await this.repository.update(id, clinicId, data)
    } catch (error: any) {
      this.logger.error(`Erro ao atualizar paciente: ${error.message}`, error.stack)
      if (error.code === '23505') {
        throw new BadRequestException('Já existe um paciente com estes dados únicos.')
      }
      throw new InternalServerErrorException('Erro ao atualizar os dados do paciente.')
    }
  }

  async updateDiagnosis(id: string, clinicId: string, data: UpdatePatientDiagnosisInput) {
    await this.findOne(id, clinicId)
    
    try {
      return await this.repository.update(id, clinicId, data)
    } catch (error: any) {
      this.logger.error(`Erro ao atualizar diagnóstico: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao atualizar o diagnóstico do paciente.')
    }
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId)
    
    try {
      await this.repository.delete(id, clinicId)
      return { message: 'Paciente removido com sucesso' }
    } catch (error: any) {
      this.logger.error(`Erro ao remover paciente: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao remover o paciente do sistema.')
    }
  }

  async getAnamnesis(id: string, clinicId: string) {
    await this.findOne(id, clinicId)
    
    try {
      return await this.repository.getAnamnesis(id, clinicId)
    } catch (error: any) {
      this.logger.error(`Erro ao buscar anamnese: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao recuperar os dados da anamnese.')
    }
  }

  async saveAnamnesis(id: string, clinicId: string, content: any) {
    await this.findOne(id, clinicId)
    
    try {
      return await this.repository.upsertAnamnesis(id, clinicId, content)
    } catch (error: any) {
      this.logger.error(`Erro ao salvar anamnese: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao salvar os dados da anamnese.')
    }
  }
}
