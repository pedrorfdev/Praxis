import { Inject, Injectable, NotFoundException, InternalServerErrorException, BadRequestException, Logger } from '@nestjs/common'
import { CaregiversRepository } from './caregivers.repository'
import type { UpdateCaregiverInput } from '@praxis/core/domain'
import { PatientsService } from '../patients/patients.service'

@Injectable()
export class CaregiversService {
  private readonly logger = new Logger(CaregiversService.name)

  constructor(
    @Inject(CaregiversRepository)
    private readonly repository: CaregiversRepository,
    @Inject(PatientsService)
    private readonly patientsService: PatientsService,
  ) {}

  async create(data: any, clinicId: string) {
    try {
      return await this.repository.create({ ...data, clinicId })
    } catch (error: any) {
      this.logger.error(`Erro ao criar cuidador: ${error.message}`, error.stack)
      if (error.code === '23505') {
        throw new BadRequestException('Já existe um cuidador com este documento nesta clínica.')
      }
      throw new InternalServerErrorException('Erro interno ao tentar cadastrar o cuidador.')
    }
  }

  async findAll(clinicId: string) {
    try {
      return await this.repository.findAllByClinic(clinicId)
    } catch (error: any) {
      this.logger.error(`Erro ao buscar cuidadores: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao buscar a lista de cuidadores.')
    }
  }

  async findOne(id: string, clinicId: string) {
    try {
      const caregiver = await this.repository.findById(id, clinicId)
      if (!caregiver)
        throw new NotFoundException('Cuidador não encontrado nesta clínica')
      return caregiver
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error
      this.logger.error(`Erro ao buscar cuidador: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao buscar as informações do cuidador.')
    }
  }

  async update(id: string, clinicId: string, data: UpdateCaregiverInput) {
    await this.findOne(id, clinicId)
    
    try {
      return await this.repository.update(id, clinicId, data)
    } catch (error: any) {
      this.logger.error(
        `Erro ao atualizar cuidador: ${error.message} | code=${error.code} | constraint=${error.constraint} | detail=${error.detail}`,
        error.stack,
      )
      if (error.code === '23505') {
        throw new BadRequestException('Documento já cadastrado para outro cuidador nesta clínica.')
      }
      throw new InternalServerErrorException('Erro ao atualizar os dados do cuidador.')
    }
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId)
    
    try {
      await this.repository.delete(id, clinicId)
      return { message: 'Cuidador removido com sucesso' }
    } catch (error: any) {
      this.logger.error(`Erro ao remover cuidador: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao remover o cuidador do sistema.')
    }
  }

  async linkToPatient(patientId: string, caregiverId: string, clinicId: string, isPrimary: boolean) {
    await this.findOne(caregiverId, clinicId)
    await this.patientsService.findOne(patientId, clinicId)
    try {
      return await this.repository.linkToPatient(patientId, caregiverId, clinicId, isPrimary)
    } catch (error: any) {
      this.logger.error(`Erro ao vincular cuidador ao paciente: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao vincular cuidador.')
    }
  }

  async unlinkFromPatient(patientId: string, caregiverId: string, clinicId: string) {
    try {
      await this.repository.unlinkFromPatient(patientId, caregiverId, clinicId)
      return { message: 'Vínculo removido com sucesso' }
    } catch (error: any) {
      this.logger.error(`Erro ao remover vínculo: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao desvincular cuidador.')
    }
  }

  async findByPatient(patientId: string, clinicId: string) {
    try {
      return await this.repository.findByPatient(patientId, clinicId)
    } catch (error: any) {
      this.logger.error(`Erro ao buscar vínculos do paciente: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro ao buscar vínculos do paciente.')
    }
  }
}
