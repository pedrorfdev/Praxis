import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createSessionSchema, updateSessionSchema } from '@praxis/core/domain';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  async create(
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(createSessionSchema)) body: any
  ) {
    return this.sessionsService.create(body, clinicId);
  }

  @Get()
  async findAll(@ActiveClinic() clinicId: string) {
    return this.sessionsService.findAll(clinicId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.sessionsService.findOne(id, clinicId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(updateSessionSchema)) body: any
  ) {
    return this.sessionsService.update(id, clinicId, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.sessionsService.remove(id, clinicId);
  }
}