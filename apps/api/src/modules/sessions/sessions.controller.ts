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
import { createSessionSchema, updateSessionSchema, type UpdateSessionInput } from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { SessionsService } from './sessions.service'

@ApiTags('Sessions')
@ApiBearerAuth('access-token')
@Controller('sessions')
export class SessionsController {
  constructor(
    @Inject(SessionsService)
    private readonly sessionsService: SessionsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar uma nova sessão de atendimento' })
  @ApiResponse({
    status: 201,
    description: 'Atendimento iniciado com sucesso.',
    schema: {
      example: {
        id: 'uuid-sessao',
        patientId: 'uuid-paciente',
        scheduledAt: '2026-03-25T14:30:00Z',
        status: 'scheduled',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
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
    @Body(new ZodValidationPipe(createSessionSchema)) body: any,
  ) {
    return this.sessionsService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar histórico de sessões' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.sessionsService.findAll(clinicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma sessão específica' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.sessionsService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da sessão (Evolução, Horário ou Faturamento)' })
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
    description: 'Sessão alterada com sucesso.',
    schema: {
      example: {
        id: 'uuid-sessao',
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
    @Body(new ZodValidationPipe(updateSessionSchema)) body: UpdateSessionInput,
  ) {
    return this.sessionsService.update(id, clinicId, body)
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
        id: 'uuid-sessao',
        status: 'cancelled',
        updatedAt: '2026-03-23T16:00:00Z',
      },
    },
  })
  async updateStatus(
    @ActiveClinic() clinicId: string,
    @Param('id') id: string,
    @Body() body: { status: 'in_progress' | 'completed' },
  ) {
    return this.sessionsService.updateStatus(clinicId, id, body.status)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover sessão' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.sessionsService.remove(id, clinicId)
  }
}
