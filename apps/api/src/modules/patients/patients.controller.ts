import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  private readonly clinicId = "id-da-clinica-demo-do-seed"; 

  @Post()
  create(@Body() body: any) {
    return this.patientsService.create(body, this.clinicId);
  }

  @Get()
  findAll() {
    return this.patientsService.findAll(this.clinicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id, this.clinicId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.patientsService.update(id, this.clinicId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id, this.clinicId);
  }
}