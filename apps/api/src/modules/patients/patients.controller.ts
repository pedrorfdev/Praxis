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
  createPatientSchema,
  updatePatientSchema,
  updatePatientDiagnosisSchema,
  type CreatePatientInput,
  type UpdatePatientInput,
  type UpdatePatientDiagnosisInput,
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
  @ApiOperation({ summary: 'Cadastrar um novo paciente (Adulto ou Criança)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['type', 'fullName', 'birthDate', 'cpf'],
      properties: {
        type: { type: 'string', example: 'ADULT', enum: ['ADULT', 'CHILD'] },
        fullName: { type: 'string', example: 'Pedro Ferreira' },
        birthDate: { type: 'string', format: 'date', example: '2006-03-30' },
        cpf: { type: 'string', example: '12345678901' },
        
        gender: { type: 'string', example: 'Masculino', nullable: true },
        phone: { type: 'string', example: '11988887777', nullable: true },
        email: { type: 'string', example: 'paciente@email.com', nullable: true },
        address: { type: 'string', example: 'Rua das Flores, 123', nullable: true },
        city: { type: 'string', example: 'São Paulo', nullable: true },
        diagnosis: { type: 'string', example: 'Avaliação Inicial', nullable: true },
        
        responsibleName: { type: 'string', example: 'Maria Souza', nullable: true },
        responsiblePhone: { type: 'string', example: '11977776666', nullable: true },
        
        birthPlace: { type: 'string', example: 'São Paulo - SP', nullable: true },
        maritalStatus: { type: 'string', example: 'Solteiro', nullable: true },
        educationLevel: { type: 'string', example: 'Superior Completo', nullable: true },
        profession: { type: 'string', example: 'Engenheiro', nullable: true },
        religion: { type: 'string', example: 'Católico', nullable: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Paciente criado com sucesso.',
    schema: {
      example: {
        id: 'uuid-gerado',
        fullName: 'João da Silva',
        email: 'joao@email.com',
        cpf: '12345678901',
        createdAt: '2026-03-23T14:00:00Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou CPF duplicado nesta clínica.'})
  async create(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(createPatientSchema)) body: CreatePatientInput,
  ) {
    return this.patientsService.create(body, clinicId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes da clínica' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.patientsService.findAll(clinicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um paciente específico' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.findOne(id, clinicId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do paciente' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizado.',
    schema: {
      example: {
        id: 'uuid-existente',
        fullName: 'João Silva Sauro',
        phone: '11988887777',
        updatedAt: '2026-03-23T15:30:00Z',
      },
    },
  })
  async update(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updatePatientSchema)) body: UpdatePatientInput,
  ) {
    return this.patientsService.update(id, clinicId, body)
  }

  @Patch(':id/diagnosis')
  @ApiOperation({ summary: 'Atualizar diagnóstico do paciente (após anamnese)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        diagnosis: { 
          type: 'string', 
          enum: ['TDAH', 'TEA', 'DEPRESSAO', 'ANSIEDADE', 'BIPOLAR', 'ESQUIZOFRENIA', 'TOC', 'PTSD', 'AUTISMO', 'SINDROME_DOWN', 'DEFICIENCIA_INTELECTUAL', 'PARALISIA_CEREBRAL', 'DISTURBIO_APRENDIZAGEM', 'GAGUEZ', 'AFASIA', 'DYSPRAXIA', 'OUTRO'],
          example: 'TDAH',
          nullable: true,
          description: 'Diagnóstico do paciente - pode ser nulo para começar vazio'
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Diagnóstico atualizado com sucesso.',
    schema: {
      example: {
        id: 'uuid-existente',
        diagnosis: 'TDAH',
        updatedAt: '2026-03-25T10:00:00Z',
      },
    },
  })
  async updateDiagnosis(
    @Param('id') id: string,
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updatePatientDiagnosisSchema)) body: UpdatePatientDiagnosisInput,
  ) {
    return this.patientsService.updateDiagnosis(id, clinicId, body)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um paciente e seu histórico' })
  @ApiResponse({
    status: 200,
    description: 'Paciente removido com sucesso.',
    schema: {
      example: {
        message: 'Paciente removido com sucesso',
        id: 'uuid-deletado',
      },
    },
  })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.remove(id, clinicId)
  }
}
