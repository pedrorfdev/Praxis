import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from '@praxis/core/domain';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
    }
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    const validatedData = loginSchema.parse(body);

    const clinic = await this.authService.validateClinic(validatedData);
    return this.authService.login(clinic);
  }
}