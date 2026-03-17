import { Injectable } from '@nestjs/common';
import { ClinicsRepository } from './clinics.repository';

@Injectable()
export class ClinicsService {
  constructor(private readonly repository: ClinicsRepository) {}

  async create(data: any) {
    return this.repository.create(data);
  }

  async findAll() {
    return this.repository.findAll();
  }
}