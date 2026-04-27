import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
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
  createCaregiverSchema,
  updateCaregiverSchema,
  type CreateCaregiverInput,
  type UpdateCaregiverInput,
} from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { CaregiversService } from './caregivers.service'

@ApiTags('Caregivers')
@ApiBearerAuth('access-token')
@Controller('caregivers')
export class CaregiversController {
  private readonly logger = new Logger(CaregiversController.name)

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
        email: { type: 'string', format: 'email', example: 'maria@email.com', nullable: true },
        zipCode: { type: 'string', example: '01001000', nullable: true },
        address: { type: 'string', example: 'Rua das Flores, 123', nullable: true },
      },
    },
  })
  @ApiOkResponse({ description: 'Cuidador criado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou documento duplicado na clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createCaregiverSchema)) body: CreateCaregiverInput,
  ) {
    return this.caregiversService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os cuidadores da clinica' })
  @ApiOkResponse({ description: 'Lista de cuidadores retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async findAll(@ActiveClinic() clinicId: string) {
    this.logger.debug(`List caregivers | clinicId=${clinicId}`)
    return this.caregiversService.findAll(clinicId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um cuidador especifico' })
  @ApiParam({ name: 'id', description: 'ID do cuidador', format: 'uuid' })
  @ApiOkResponse({ description: 'Cuidador encontrado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Cuidador nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    this.logger.debug(`Get caregiver details | clinicId=${clinicId} caregiverId=${id}`)
    return this.caregiversService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do cuidador' })
  @ApiParam({ name: 'id', description: 'ID do cuidador', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Maria da Silva Souza' },
        phone: { type: 'string', example: '11995554444' },
        address: { type: 'string', example: 'Rua Nova, 500' },
      },
    },
  })
  @ApiOkResponse({ status: 200, description: 'Cuidador atualizado.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou documento duplicado na clinica.' })
  @ApiNotFoundResponse({ description: 'Cuidador nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateCaregiverSchema)) body: UpdateCaregiverInput,
  ) {
    return this.caregiversService.update(id, clinicId, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um cuidador' })
  @ApiParam({ name: 'id', description: 'ID do cuidador', format: 'uuid' })
  @ApiOkResponse({ description: 'Cuidador removido com sucesso.' })
  @ApiNotFoundResponse({ description: 'Cuidador nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.caregiversService.remove(id, clinicId)
  }

  @Post(':id/patients/:patientId')
  @ApiOperation({ summary: 'Vincular cuidador a um paciente' })
  @ApiParam({ name: 'id', description: 'ID do cuidador', format: 'uuid' })
  @ApiParam({ name: 'patientId', description: 'ID do paciente', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isPrimary: { type: 'boolean', example: true },
      },
    },
  })
  @ApiOkResponse({ description: 'Vinculo criado/atualizado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Paciente ou cuidador nao encontrado na clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async linkToPatient(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
    @ActiveClinic() clinicId: string,
    @Body() body: { isPrimary?: boolean },
  ) {
    const isPrimary = body?.isPrimary ?? false
    this.logger.debug(
      `Link caregiver to patient | clinicId=${clinicId} caregiverId=${id} patientId=${patientId} isPrimary=${Boolean(isPrimary)}`,
    )
    return this.caregiversService.linkToPatient(patientId, id, clinicId, isPrimary)
  }

  @Delete(':id/patients/:patientId')
  @ApiOperation({ summary: 'Desvincular cuidador de um paciente' })
  @ApiParam({ name: 'id', description: 'ID do cuidador', format: 'uuid' })
  @ApiParam({ name: 'patientId', description: 'ID do paciente', format: 'uuid' })
  @ApiOkResponse({ description: 'Vinculo removido com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async unlinkFromPatient(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
    @ActiveClinic() clinicId: string,
  ) {
    this.logger.debug(
      `Unlink caregiver from patient | clinicId=${clinicId} caregiverId=${id} patientId=${patientId}`,
    )
    return this.caregiversService.unlinkFromPatient(patientId, id, clinicId)
  }
}
