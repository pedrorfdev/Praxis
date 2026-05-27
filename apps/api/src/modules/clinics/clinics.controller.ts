import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { updateClinicWithCurrentPasswordSchema} from '@praxis/core/domain'
import { ActiveClinic } from '../../common/decorators/active-clinic.decorator'
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe'
import { ClinicsService } from './clinics.service'

@ApiTags('Clinics')
@ApiBearerAuth('access-token')
@Controller('clinics')
export class ClinicsController {
  constructor(
    @Inject(ClinicsService)
    private readonly clinicsService: ClinicsService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Retorna os dados da clinica logada' })
  @ApiOkResponse({
    description: 'Dados da clinica retornados com sucesso.',
    schema: {
      example: {
        id: '67f9aa31-cc41-4014-b0e4-6af6a88fcd00',
        name: 'Clinica Praxis',
        email: 'contato@praxis.com',
        slug: 'clinica-praxis',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async getProfile(@ActiveClinic() clinicId: string) {
    const clinic = await this.clinicsService.findById(clinicId)
    if (!clinic) throw new NotFoundException('Clinica nao encontrada')

    const { password, ...safeClinic } = clinic
    return safeClinic
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza os dados da clinica logada' })
  @ApiBody({
    description: 'Dados para atualizacao da clinica',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Clinica Praxis Unidade 2' },
        email: { type: 'string', format: 'email', example: 'contato+2@praxis.com' },
        currentPassword: { type: 'string', example: 'SenhaAtual123' },
        password: { type: 'string', example: 'NovaSenha123' },
      },
    },
  })
  @ApiOkResponse({ description: 'Clinica atualizada com sucesso.' })
  @ApiBadRequestResponse({ description: 'Dados invalidos.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  async update(
    @ActiveClinic() clinicId: string,
    @Body(new ZodValidationPipe(updateClinicWithCurrentPasswordSchema)) data: any,
  ) {
    return this.clinicsService.update(clinicId, data)
  }

  @Delete('me')
  @ApiOperation({ summary: 'Remove a conta da clinica logada' })
  @ApiNoContentResponse({ description: 'Conta removida com sucesso.' })
  @ApiUnauthorizedResponse({ description: 'Token invalido ou ausente.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@ActiveClinic() clinicId: string) {
    return this.clinicsService.delete(clinicId)
  }
}
