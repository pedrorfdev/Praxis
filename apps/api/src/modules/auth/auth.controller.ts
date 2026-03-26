import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { type LoginInput, loginSchema } from '@praxis/core/domain'
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
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginInput) {
    const validatedData = loginSchema.parse(body);
    console.log('🔍 AuthService injetado?', !!this.authService);
    console.log('🔍 chegou no validate?', validatedData);

    const clinic = await this.authService.validateClinic(validatedData);
    return this.authService.login(clinic);
  }
}
