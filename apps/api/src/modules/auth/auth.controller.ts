import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
  type LoginInput,
  loginSchema,
  type ResetPasswordInput,
  resetPasswordSchema,
} from '@praxis/core/domain'
import { Public } from '../../common/decorators/public.decorator'
import { AuthService } from './auth.service'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login e obter token de acesso' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email', example: 'contato@praxis.com' },
        password: { type: 'string', example: 'SenhaForte123' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Login bem-sucedido.',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais invalidas.' })
  @ApiBadRequestResponse({ description: 'Payload invalido.' })
  @Post('login')
  async login(@Body() body: LoginInput) {
    const validatedData = loginSchema.parse(body)
    const clinic = await this.authService.validateClinic(validatedData)
    return this.authService.login(clinic)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperacao de senha' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email', example: 'contato@praxis.com' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Solicitacao processada.',
    schema: {
      example: { message: 'Se o e-mail existir, voce recebera as instrucoes.' },
    },
  })
  @ApiBadRequestResponse({ description: 'Payload invalido.' })
  @Post('forgot')
  async forgotPassword(@Body() body: ForgotPasswordInput) {
    const validatedData = forgotPasswordSchema.parse(body)
    return this.authService.forgotPassword(validatedData)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefinir senha com token' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['token', 'password'],
      properties: {
        token: { type: 'string', example: 'abc123...' },
        password: { type: 'string', example: 'NovaSenha123' },
      },
    },
  })
  @ApiOkResponse({
    description: 'Senha redefinida com sucesso.',
    schema: {
      example: { message: 'Senha redefinida com sucesso' },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Token invalido/expirado ou senha fora dos requisitos (min. 8 caracteres, 1 maiuscula e 1 numero).',
  })
  @Post('reset')
  async resetPassword(@Body() body: ResetPasswordInput) {
    const validatedData = resetPasswordSchema.parse(body)
    return this.authService.resetPassword(validatedData)
  }
}
