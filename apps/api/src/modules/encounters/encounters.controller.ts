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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {
  createEncounterSchema,
  updateEncounterSchema,
  type UpdateEncounterInput,
} from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { EncountersService } from './encounters.service'

@ApiTags('Encounters')
@ApiBearerAuth('access-token')
@Controller('encounters')
export class EncountersController {
  constructor(
    @Inject(EncountersService)
    private readonly encountersService: EncountersService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar um novo atendimento' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['patientId'],
      properties: {
        patientId: { type: 'string', format: 'uuid', example: '67f9aa31-cc41-4014-b0e4-6af6a88fcd00' },
        startAt: { type: 'string', format: 'date-time', example: '2026-03-30T14:30:00Z' },
        durationInMinutes: { type: 'integer', example: 60 },
        sessionValueInCents: { type: 'integer', example: 12000, description: 'Valor da consulta em centavos.' },
        billingType: { type: 'string', enum: ['PRIVATE', 'SUBSIDIZED'], example: 'PRIVATE' },
        status: { type: 'string', enum: ['in_progress', 'completed'], example: 'in_progress' },
        content: { type: 'string', example: 'Iniciando atendimento...' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Atendimento iniciado com sucesso.',
    schema: {
      example: {
        id: '3f8f4d0a-1b7f-466b-b9df-6367dbf5aef3',
        patientId: '67f9aa31-cc41-4014-b0e4-6af6a88fcd00',
        startAt: '2026-03-25T14:30:00Z',
        status: 'in_progress',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createEncounterSchema)) body: any,
  ) {
    return this.encountersService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar historico de atendimentos' })
  @ApiOkResponse({ description: 'Lista de atendimentos retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.encountersService.findAll(clinicId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um atendimento especifico' })
  @ApiParam({ name: 'id', description: 'ID do atendimento', format: 'uuid' })
  @ApiOkResponse({ description: 'Atendimento encontrado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Atendimento nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.encountersService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do atendimento' })
  @ApiParam({ name: 'id', description: 'ID do atendimento', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        patientId: { type: 'string', format: 'uuid', example: '67f9aa31-cc41-4014-b0e4-6af6a88fcd00' },
        startAt: { type: 'string', format: 'date-time', example: '2026-03-30T14:30:00Z' },
        durationInMinutes: { type: 'integer', example: 50 },
        sessionValueInCents: { type: 'integer', example: 12000, description: 'Valor da consulta em centavos.' },
        content: { type: 'string', example: 'Paciente apresentou melhora na coordenacao motora fina.' },
        billingType: { type: 'string', enum: ['PRIVATE', 'SUBSIDIZED'], example: 'SUBSIDIZED' },
        status: { type: 'string', enum: ['in_progress', 'completed'], example: 'completed' },
      },
    },
  })
  @ApiOkResponse({ description: 'Atendimento alterado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Atendimento nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateEncounterSchema)) body: UpdateEncounterInput,
  ) {
    return this.encountersService.update(id, clinicId, body)
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do atendimento' })
  @ApiParam({ name: 'id', description: 'ID do atendimento', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['status'],
      properties: {
        status: {
          type: 'string',
          enum: ['in_progress', 'completed'],
          example: 'completed',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Status do atendimento atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Status invalido.' })
  @ApiNotFoundResponse({ description: 'Atendimento nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async updateStatus(
    @ActiveClinic() clinicId: string,
    @Param('id') id: string,
    @Body() body: { status: 'in_progress' | 'completed' },
  ) {
    return this.encountersService.updateStatus(clinicId, id, body.status)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover atendimento' })
  @ApiParam({ name: 'id', description: 'ID do atendimento', format: 'uuid' })
  @ApiOkResponse({ description: 'Atendimento removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Atendimento nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.encountersService.delete(id, clinicId)
  }
}
