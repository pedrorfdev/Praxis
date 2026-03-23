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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { ClinicsService } from './clinics.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createClinicSchema, updateClinicSchema } from '@praxis/core/domain';
import { Public } from '../../common/decorators/public.decorator';
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator';

@ApiTags('Clinics')
@ApiBearerAuth('access-token')
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Public()
  @ApiOperation({ summary: 'Registrar uma nova clínica (Acesso Público)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', example: 'Clínica Praxis' },
        email: { type: 'string', example: 'contato@praxis.com' },
        password: { type: 'string', example: 'senha123' },
      },
    },
  })
  @Post()
  @UsePipes(new ZodValidationPipe(createClinicSchema))
  async create(@Body() data: any) {
    return this.clinicsService.create(data);
  }

  @Get('me')
  @ApiOperation({ summary: 'Retorna os dados da clínica logada' })
  @ApiResponse({ status: 200, description: 'Dados da clínica retornados com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getProfile(@ActiveClinic() clinicId: string) {
    const clinic = await this.clinicsService.findById(clinicId);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');
    
    const { password, ...safeClinic } = clinic;
    return safeClinic;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza os dados da clínica logada' })
  @ApiBody({
    description: 'Dados para atualização da clínica',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Clínica Sorriso Real' },
        phone: { type: 'string', example: '11999999999' },
        address: { type: 'string', example: 'Rua das Flores, 123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Clínica atualizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async update(
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(updateClinicSchema)) data: any
  ) {
    return this.clinicsService.update(clinicId, data);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Remove a conta da clínica logada' })
  @ApiResponse({ status: 200, description: 'Conta removida com sucesso.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@ActiveClinic() clinicId: string) {
    return this.clinicsService.delete(clinicId);
  }
}