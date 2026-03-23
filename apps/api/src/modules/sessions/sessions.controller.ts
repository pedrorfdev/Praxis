import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createSessionSchema, updateSessionSchema } from '@praxis/core/domain';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sessions')
@ApiBearerAuth('access-token')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Agendar uma nova sessão' })
  @ApiResponse({ 
    status: 201, 
    description: 'Sessão agendada.',
    schema: {
      example: {
        id: "uuid-sessao",
        patientId: "uuid-paciente",
        scheduledAt: "2026-03-25T14:30:00Z",
        status: "scheduled"
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Sessão não encontrada.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['patientId', 'scheduledAt'],
      properties: {
        patientId: {
          type: 'string',
          format: 'uuid',
          example: 'uuid-do-paciente',
        },
        scheduledAt: {
          type: 'string',
          format: 'date-time',
          example: '2026-03-25T14:30:00Z',
        },
        content: {
          type: 'string',
          example: 'Relato da evolução do paciente...',
          description: 'Notas da sessão',
        },
        status: {
          type: 'string',
          enum: ['scheduled', 'completed', 'cancelled'],
          default: 'scheduled',
        },
      },
    },
  })
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createSessionSchema)) body: any,
  ) {
    return this.sessionsService.create(body, clinicId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agenda da clínica' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.sessionsService.findAll(clinicId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.sessionsService.findOne(id, clinicId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados da sessão' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patientId: { type: 'string', format: 'uuid', example: 'novo-uuid-do-paciente' },
        scheduledAt: { type: 'string', format: 'date-time' },
        content: { type: 'string' },
        status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Sessão alterada com sucesso.',
    schema: {
      example: {
        id: "uuid-sessao",
        patientId: "uuid-novo-paciente",
        content: "Conteúdo atualizado da sessão",
        status: "completed"
      }
    }
  })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateSessionSchema)) body: any,
  ) {
    return this.sessionsService.update(id, clinicId, body);
  }

    @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar apenas o status da sessão' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['scheduled', 'completed', 'cancelled'],
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200, 
    schema: {
      example: { id: "uuid-sessao", status: "cancelled", updatedAt: "2026-03-23T16:00:00Z" }
    }
  })
  async updateStatus(
    @ActiveClinic() clinicId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.sessionsService.updateStatus(clinicId, id, body.status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar/Remover sessão' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.sessionsService.remove(id, clinicId);
  }
}
