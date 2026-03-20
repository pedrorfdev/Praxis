import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientsRepository } from './patients.repository';

@Injectable()
export class PatientsService {
  constructor(private readonly repository: PatientsRepository) {}

  async create(data: any, clinicId: string) {
    return this.repository.create({ ...data, clinicId });
  }

  async findAll(clinicId: string) {
    return this.repository.findAllByClinic(clinicId);
  }

  async findOne(id: string, clinicId: string) {
    const patient = await this.repository.findById(id, clinicId);
    if (!patient) throw new NotFoundException('Paciente não encontrado nesta clínica');
    return patient;
  }

  async update(id: string, clinicId: string, data: any) {
    await this.findOne(id, clinicId);
    
    const updatedPatient = await this.repository.update(id, clinicId, data);
    return updatedPatient;
  }

  async remove(id: string, clinicId: string) {
    await this.findOne(id, clinicId);
    await this.repository.delete(id, clinicId);
    return { message: 'Paciente removido com sucesso' };
  }
}