import {
  Injectable,
  ConflictException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { ClinicsRepository } from './clinics.repository';
import type { CreateClinicInput, UpdateClinicInput } from '@praxis/core/domain';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ClinicsService {
  constructor(
    @Inject(ClinicsRepository)
    private readonly repository: ClinicsRepository) {}

  async create(data: CreateClinicInput) {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Este e-mail já está em uso.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return this.repository.create({
      ...data,
      slug,
      password: hashedPassword,
    });
  }

  async findById(id: string) {
    const clinic = await this.repository.findById(id);
    if (!clinic) throw new NotFoundException('Clínica não encontrada.');
    return clinic;
  }

  async update(id: string, data: UpdateClinicInput) {
    const updateData = { ...data };

    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedClinic = await this.repository.update(id, updateData);
    if (!updatedClinic)
      throw new NotFoundException('Clínica não encontrada para atualizar.');

    return updatedClinic;
  }

  async delete(id: string) {
    await this.findById(id);
    await this.repository.delete(id);
    return { message: 'Conta removida com sucesso.' };
  }

  async findAll() {
    return this.repository.findAll();
  }
}
