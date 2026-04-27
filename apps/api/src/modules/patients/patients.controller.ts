import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
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
  createPatientSchema,
  updatePatientSchema,
  updatePatientDiagnosisSchema,
  updateAnamnesisSchema,
  type CreatePatientInput,
  type UpdatePatientInput,
  type UpdatePatientDiagnosisInput,
  type UpdateAnamnesisInput,
} from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { PatientsService } from './patients.service'

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientsController {
  constructor(
    @Inject(PatientsService)
    private readonly patientsService: PatientsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo paciente (adulto ou crianca)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'type',
        'fullName',
        'birthDate',
        'gender',
        'address',
        'city',
        'birthPlace',
        'maritalStatus',
        'educationLevel',
        'profession',
        'religion',
      ],
      properties: {
        type: { type: 'string', enum: ['ADULT', 'CHILD'], example: 'ADULT' },
        fullName: { type: 'string', example: 'Pedro Ferreira' },
        birthDate: { type: 'string', format: 'date', example: '2006-03-30' },
        gender: { type: 'string', example: 'Masculino' },
        phone: { type: 'string', example: '11988887777', nullable: true },
        address: { type: 'string', example: 'Rua das Flores, 123' },
        city: { type: 'string', example: 'Sao Paulo' },
        diagnosis: {
          type: 'string',
          enum: [
            'TDAH',
            'TEA',
            'DEPRESSAO',
            'ANSIEDADE',
            'BIPOLAR',
            'ESQUIZOFRENIA',
            'TOC',
            'PTSD',
            'AUTISMO',
            'SINDROME_DOWN',
            'DEFICIENCIA_INTELECTUAL',
            'PARALISIA_CEREBRAL',
            'DISTURBIO_APRENDIZAGEM',
            'GAGUEZ',
            'AFASIA',
            'DYSPRAXIA',
            'OUTRO',
          ],
          nullable: true,
          example: 'TDAH',
        },
        cpf: { type: 'string', example: '12345678901', nullable: true },
        responsibleName: { type: 'string', example: 'Maria Souza', nullable: true },
        responsiblePhone: { type: 'string', example: '11977776666', nullable: true },
        birthPlace: { type: 'string', example: 'Sao Paulo - SP' },
        maritalStatus: { type: 'string', example: 'Solteiro' },
        educationLevel: { type: 'string', example: 'Superior Completo' },
        profession: { type: 'string', example: 'Engenheiro' },
        religion: { type: 'string', example: 'Catolico' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Paciente criado com sucesso.',
    schema: {
      example: {
        id: '67f9aa31-cc41-4014-b0e4-6af6a88fcd00',
        fullName: 'Joao da Silva',
        cpf: '12345678901',
        createdAt: '2026-03-23T14:00:00Z',
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados invalidos ou CPF duplicado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createPatientSchema)) body: CreatePatientInput,
  ) {
    return this.patientsService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes da clinica' })
  @ApiOkResponse({ description: 'Lista de pacientes retornada com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.patientsService.findAll(clinicId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um paciente especifico' })
  @ApiParam({ name: 'id', description: 'ID do paciente', format: 'uuid' })
  @ApiOkResponse({ description: 'Paciente encontrado com sucesso.' })
  @ApiNotFoundResponse({ description: 'Paciente nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Joao Silva Sauro' },
        phone: { type: 'string', example: '11988887777' },
        address: { type: 'string', example: 'Av. Paulista, 1000' },
      },
    },
  })
  @ApiOkResponse({ description: 'Paciente atualizado.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Paciente nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updatePatientSchema)) body: UpdatePatientInput,
  ) {
    return this.patientsService.update(id, clinicId, body)
  }

  @Patch(':id/diagnosis')
  @ApiOperation({ summary: 'Atualizar diagnostico do paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        diagnosis: {
          type: 'string',
          enum: [
            'TDAH',
            'TEA',
            'DEPRESSAO',
            'ANSIEDADE',
            'BIPOLAR',
            'ESQUIZOFRENIA',
            'TOC',
            'PTSD',
            'AUTISMO',
            'SINDROME_DOWN',
            'DEFICIENCIA_INTELECTUAL',
            'PARALISIA_CEREBRAL',
            'DISTURBIO_APRENDIZAGEM',
            'GAGUEZ',
            'AFASIA',
            'DYSPRAXIA',
            'OUTRO',
          ],
          nullable: true,
          example: 'TDAH',
          description: 'Diagnostico do paciente, pode ser nulo.',
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Diagnostico atualizado com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Paciente nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async updateDiagnosis(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updatePatientDiagnosisSchema)) body: UpdatePatientDiagnosisInput,
  ) {
    return this.patientsService.updateDiagnosis(id, clinicId, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um paciente e seu historico' })
  @ApiParam({ name: 'id', description: 'ID do paciente', format: 'uuid' })
  @ApiOkResponse({
    description: 'Paciente removido com sucesso.',
    schema: {
      example: {
        message: 'Paciente removido com sucesso',
        id: '67f9aa31-cc41-4014-b0e4-6af6a88fcd00',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Paciente nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.remove(id, clinicId)
  }

  @Get(':id/anamnesis')
  @ApiOperation({ summary: 'Obter a anamnese de um paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente', format: 'uuid' })
  @ApiOkResponse({ description: 'Anamnese recuperada com sucesso.' })
  @ApiNotFoundResponse({ description: 'Paciente nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async getAnamnesis(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.getAnamnesis(id, clinicId)
  }

  @Put(':id/anamnesis')
  @ApiOperation({ summary: 'Salvar ou atualizar a anamnese de um paciente' })
  @ApiParam({ name: 'id', description: 'ID do paciente', format: 'uuid' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['content'],
      properties: {
        content: {
          type: 'object',
          description: 'Dados flexiveis da anamnese.',
          example: {
            queixaPrincipal: 'Dificuldade de concentracao',
            historiaAtual: 'Sintomas ha cerca de 6 meses',
          },
        },
      },
    },
  })
  @ApiOkResponse({ description: 'Anamnese salva com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiNotFoundResponse({ description: 'Paciente nao encontrado nesta clinica.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async saveAnamnesis(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateAnamnesisSchema)) body: UpdateAnamnesisInput,
  ) {
    return this.patientsService.saveAnamnesis(id, clinicId, body.content)
  }
}
