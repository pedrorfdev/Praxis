import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import type { CreateClinicInput, UpdateClinicInput } from '@praxis/core/domain'
import * as bcrypt from 'bcryptjs'
import { ClinicsRepository } from './clinics.repository'

@Injectable()
export class ClinicsService {
  private readonly logger = new Logger(ClinicsService.name)

  constructor(
    @Inject(ClinicsRepository)
    private readonly repository: ClinicsRepository,
  ) {}

  async create(data: CreateClinicInput) {
    try {
      const existing = await this.repository.findByEmail(data.email)
      if (existing) {
        throw new ConflictException('Este e-mail já está em uso.')
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(data.password, salt)

      const slug = data.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')

      return await this.repository.create({
        ...data,
        slug,
        password: hashedPassword,
      })
    } catch (error: any) {
      if (error instanceof ConflictException) throw error
      this.logger.error(`Erro ao criar clínica: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao tentar criar a clínica.')
    }
  }

  async findById(id: string) {
    try {
      const clinic = await this.repository.findById(id)
      if (!clinic) throw new NotFoundException('Clínica não encontrada.')
      return clinic
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error
      this.logger.error(`Erro ao buscar clínica: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao buscar dados da clínica.')
    }
  }

  async update(id: string, data: UpdateClinicInput) {
    try {
      const updateData = { ...data }

      if (updateData.password) {
        const salt = await bcrypt.genSalt(10)
        updateData.password = await bcrypt.hash(updateData.password, salt)
      }

      const updatedClinic = await this.repository.update(id, updateData)
      if (!updatedClinic)
        throw new NotFoundException('Clínica não encontrada para atualizar.')

      return updatedClinic
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error
      this.logger.error(`Erro ao atualizar clínica: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao atualizar a clínica.')
    }
  }

  async delete(id: string) {
    await this.findById(id)
    try {
      await this.repository.delete(id)
      return { message: 'Conta removida com sucesso.' }
    } catch (error: any) {
      this.logger.error(`Erro ao deletar clínica: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao deletar a conta.')
    }
  }

  async findAll() {
    try {
      return await this.repository.findAll()
    } catch (error: any) {
      this.logger.error(`Erro ao listar clínicas: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao buscar as clínicas.')
    }
  }
}
