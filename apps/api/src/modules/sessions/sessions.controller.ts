import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  private readonly clinicId = "id-da-clinica-demo-do-seed"; 

  @Post()
  create(@Body() body: any) {
    return this.sessionsService.create(body, this.clinicId);
  }

  @Get()
  findAll() {
    return this.sessionsService.findAll(this.clinicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id, this.clinicId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.sessionsService.update(id, this.clinicId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(id, this.clinicId);
  }
}