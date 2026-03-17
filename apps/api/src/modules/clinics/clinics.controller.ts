import { Controller, Post, Body, Get, UsePipes } from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createClinicSchema } from '@praxis/core/domain';

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createClinicSchema))
  async create(@Body() data: any) {
    return this.clinicsService.create(data);
  }

  @Get()
  async findAll() {
    return this.clinicsService.findAll();
  }
}