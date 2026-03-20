import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createPatientSchema, updatePatientSchema } from '@praxis/core/domain';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  async create(
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(createPatientSchema)) body: any
  ) {
    return this.patientsService.create(body, clinicId);
  }

  @Get()
  async findAll(@ActiveClinic() clinicId: string) {
    return this.patientsService.findAll(clinicId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.findOne(id, clinicId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(updatePatientSchema)) body: any
  ) {
    return this.patientsService.update(id, clinicId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.remove(id, clinicId);
  }
}