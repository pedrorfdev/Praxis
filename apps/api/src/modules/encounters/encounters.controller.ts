import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { createEncounterSchema, updateEncounterSchema, type UpdateEncounterInput } from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { EncountersService } from './encounters.service'

@ApiTags('Encounters')
@ApiBearerAuth('access-token')
@Controller('encounters')
export class EncountersController {
  constructor(
    @Inject(EncountersService)
    private readonly encountersService: EncountersService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar um novo atendimento' })
  @ApiResponse({
    status: 201,
    description: 'Atendimento iniciado com sucesso.',
    schema: {
      example: {
        id: 'uuid-encounter',
        patientId: 'uuid-paciente',
        startAt: '2026-03-25T14:30:00Z',
        status: 'in_progress',
      },
    },
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['patientId'],
      properties: {
        patientId: { type: 'string', format: 'uuid', example: 'uuid-do-paciente' },
        startAt: { type: 'string', format: 'date-time', example: '2026-03-30T14:30:00Z' },
        billingType: { type: 'string', enum: ['PRIVATE', 'SUBSIDIZED'], example: 'PRIVATE' },
        content: { type: 'string', example: 'Iniciando atendimento...', description: 'Evolução inicial' },
      },
    },
  })
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createEncounterSchema)) body: any,
  ) {
    return this.encountersService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar histórico de atendimentos' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.encountersService.findAll(clinicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um atendimento específico' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.encountersService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do atendimento (Evolução, Horário ou Faturamento)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patientId: {
          type: 'string',
          format: 'uuid',
          example: 'novo-uuid-do-paciente',
        },
        startAt: { 
          type: 'string', 
          format: 'date-time', 
          example: '2026-03-30T14:30:00Z' 
        },
        content: { 
          type: 'string', 
          example: 'Paciente apresentou melhora na coordenação motora fina...' 
        },
        billingType: { 
          type: 'string', 
          enum: ['PRIVATE', 'SUBSIDIZED'],
          example: 'PRIVATE'
        },
        status: {
          type: 'string',
          enum: ['in_progress', 'completed'],
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Atendimento alterado com sucesso.',
    schema: {
      example: {
        id: 'uuid-encounter',
        patientId: 'uuid-paciente',
        content: 'Conteúdo atualizado',
        billingType: 'SUBSIDIZED',
        status: 'completed',
        updatedAt: '2026-03-30T16:00:00Z',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateEncounterSchema)) body: UpdateEncounterInput,
  ) {
    return this.encountersService.update(id, clinicId, body)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Finalizar atendimento (mudar status para completed)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['in_progress', 'completed']
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        id: 'uuid-encounter',
        status: 'completed',
        updatedAt: '2026-03-23T16:00:00Z',
      },
    },
  })
  async updateStatus(
    @ActiveClinic() clinicId: string,
    @Param('id') id: string,
    @Body() body: { status: 'in_progress' | 'completed' },
  ) {
    return this.encountersService.updateStatus(clinicId, id, body.status)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover atendimento' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.encountersService.delete(id, clinicId)
  }
}
