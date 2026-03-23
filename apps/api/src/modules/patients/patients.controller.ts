import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { createPatientSchema, updatePatientSchema } from '@praxis/core/domain';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Patients')
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar um novo paciente' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['fullName'],
      properties: {
        fullName: { type: 'string', example: 'João da Silva' },
        email: { type: 'string', example: 'joao@email.com', nullable: true },
        phone: { type: 'string', example: '11912345678', nullable: true },
        cpf: { type: 'string', example: '12345678901', nullable: true },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Paciente criado com sucesso.',
    schema: {
      example: {
        id: "uuid-gerado",
        fullName: "João da Silva",
        email: "joao@email.com",
        cpf: "12345678901",
        createdAt: "2026-03-23T14:00:00Z"
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou CPF duplicado nesta clínica.' })
  async create(
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(createPatientSchema)) body: any
  ) {
    return this.patientsService.create(body, clinicId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes da clínica' })
  async findAll(@ActiveClinic() clinicId: string) {
    return this.patientsService.findAll(clinicId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um paciente específico' })
  async findOne(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.findOne(id, clinicId);
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
        id: "uuid-existente",
        fullName: "João Silva Sauro",
        phone: "11988887777",
        updatedAt: "2026-03-23T15:30:00Z"
      }
    }
  })
  async update(
    @Param('id') id: string, 
    @ActiveClinic() clinicId: string, 
    @Body(new ZodValidationPipe(updatePatientSchema)) body: any
  ) {
    return this.patientsService.update(id, clinicId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um paciente e seu histórico' })
  @ApiResponse({ 
    status: 200, 
    description: 'Paciente removido com sucesso.',
    schema: {
      example: { message: "Paciente removido com sucesso", id: "uuid-deletado" }
    }
  })
  async remove(@Param('id') id: string, @ActiveClinic() clinicId: string) {
    return this.patientsService.remove(id, clinicId);
  }
}