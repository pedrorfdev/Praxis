import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  UsePipes, 
  Patch, 
  Delete, 
  NotFoundException, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { ClinicsService } from './clinics.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createClinicSchema, updateClinicSchema } from '@praxis/core/domain';
import { Public } from '../../common/decorators/public.decorator';
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator';

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createClinicSchema))
  async create(@Body() data: any) {
    return this.clinicsService.create(data);
  }

  @Get('me')
  async getProfile(@ActiveClinic() clinicId: string) {
    const clinic = await this.clinicsService.findById(clinicId);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');
    
    const { password, ...safeClinic } = clinic;
    return safeClinic;
  }

  @Patch('me')
  async update(
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(updateClinicSchema)) data: any
  ) {
    return this.clinicsService.update(clinicId, data);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@ActiveClinic() clinicId: string) {
    return this.clinicsService.delete(clinicId);
  }
}