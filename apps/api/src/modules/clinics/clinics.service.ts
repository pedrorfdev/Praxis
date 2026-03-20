import { Injectable } from '@nestjs/common';
import { ClinicsRepository } from './clinics.repository';
import type { CreateClinicInput, UpdateClinicInput } from '@praxis/core/domain';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ClinicsService {
  constructor(private readonly repository: ClinicsRepository) {}

  async create(data: CreateClinicInput) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    return this.repository.create({
      ...data,
      password: hashedPassword,
    });
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string){
    return this.repository.findById(id)
  }
  async update(id: string, data: UpdateClinicInput){
    const updateData = { ...data }

    if(updateData.password){
      const salt = await bcrypt.genSalt(10)
      updateData.password = await bcrypt.hash(updateData.password, salt)
    }

    return this.repository.update(id, updateData)
  }
  async delete(id: string){
    return this.repository.delete(id)
  }
}