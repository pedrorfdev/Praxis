import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { type LoginInput, loginSchema, type ForgotPasswordInput, forgotPasswordSchema, type ResetPasswordInput, resetPasswordSchema } from '@praxis/core/domain'
import { Public } from '../../common/decorators/public.decorator'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService
  ) {
    console.log('🔍 AuthService injetado?', !!this.authService);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login e obter token de acesso' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'contato@praxis.com' },
        password: { type: 'string', example: 'senha123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido',
    schema: {
      example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
    },
  })
  @Post('login')
  async login(@Body() body: LoginInput) {
    const validatedData = loginSchema.parse(body);
    console.log('🔍 AuthService injetado?', !!this.authService);
    console.log('🔍 chegou no validate?', validatedData);

    const clinic = await this.authService.validateClinic(validatedData);
    return this.authService.login(clinic);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar recuperação de senha' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', example: 'contato@praxis.com' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitação processada',
    schema: {
      example: { message: 'Se o e-mail existir, você receberá as instruções.' },
    },
  })
  @Post('forgot')
  async forgotPassword(@Body() body: ForgotPasswordInput) {
    const validatedData = forgotPasswordSchema.parse(body);
    return this.authService.forgotPassword(validatedData);
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
        password: { type: 'string', example: 'novaSenha123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Senha redefinida com sucesso',
    schema: {
      example: { message: 'Senha redefinida com sucesso' },
    },
  })
  @Post('reset')
  async resetPassword(@Body() body: ResetPasswordInput) {
    const validatedData = resetPasswordSchema.parse(body);
    return this.authService.resetPassword(validatedData);
  }
}
