import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientsRepository } from './patients.repository';
import { createPatientSchema, updatePatientSchema } from '@praxis/core/domain';

@Injectable()
export class PatientsService {
  constructor(private readonly repository: PatientsRepository) {}

  async create(data: any, clinicId: string) {
    const validatedData = createPatientSchema.parse(data);
    return this.repository.create({ ...validatedData, clinicId });
  }

  async findAll(clinicId: string) {
    return this.repository.findAllByClinic(clinicId);
  }

  async findOne(id: string, clinicId: string) {
    const patient = await this.repository.findById(id, clinicId);
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    return patient;
  }

  async update(id: string, clinicId: string, data: any) {
    const validatedData = updatePatientSchema.parse(data);
    const updatedPatient = await this.repository.update(id, clinicId, validatedData);
    if (!updatedPatient) throw new NotFoundException('Paciente não encontrado para atualizar');
    return updatedPatient;
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);
    return this.repository.delete(id, clinicId);
  }
}