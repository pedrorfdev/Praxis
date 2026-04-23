import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  createCaregiverSchema,
  updateCaregiverSchema,
  type CreateCaregiverInput,
  type UpdateCaregiverInput,
  linkCaregiverSchema,
  type LinkCaregiverInput,
} from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { CaregiversService } from './caregivers.service'

@ApiTags('Caregivers')
@ApiBearerAuth('access-token')
@Controller('caregivers')
export class CaregiversController {
  constructor(
    @Inject(CaregiversService)
    private readonly caregiversService: CaregiversService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo cuidador' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['name', 'document', 'phone'],
      properties: {
        name: { type: 'string', example: 'Maria da Silva' },
        document: { type: 'string', example: '12345678901' },
        phone: { type: 'string', example: '11988887777' },
        email: { type: 'string', example: 'maria@email.com', nullable: true },
        zipCode: { type: 'string', example: '01001000', nullable: true },
        address: { type: 'string', example: 'Rua das Flores, 123', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Cuidador criado com sucesso.',
  })
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createCaregiverSchema)) body: CreateCaregiverInput,
  ) {
    return this.caregiversService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cuidadores da clínica' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.caregiversService.findAll(clinicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um cuidador específico' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.caregiversService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do cuidador' })
  @ApiResponse({ status: 200, description: 'Cuidador atualizado.' })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateCaregiverSchema)) body: UpdateCaregiverInput,
  ) {
    return this.caregiversService.update(id, clinicId, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cuidador' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.caregiversService.remove(id, clinicId)
  }

  @Post(':id/patients/:patientId')
  @ApiOperation({ summary: 'Vincular cuidador a um paciente' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isPrimary: { type: 'boolean', example: true },
      },
    },
  })
  async linkToPatient(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
    @ActiveClinic() clinicId: string,
    @Body() body: { isPrimary: boolean },
  ) {
    return this.caregiversService.linkToPatient(patientId, id, clinicId, body.isPrimary)
  }

  @Delete(':id/patients/:patientId')
  @ApiOperation({ summary: 'Desvincular cuidador de um paciente' })
  async unlinkFromPatient(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
    @ActiveClinic() clinicId: string,
  ) {
    return this.caregiversService.unlinkFromPatient(patientId, id, clinicId)
  }
}
