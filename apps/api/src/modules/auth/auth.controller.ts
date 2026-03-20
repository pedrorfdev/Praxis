import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginSchema } from '@praxis/core/domain';
import { Public } from 'src/common/decorators/public-decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: any) {
    const validatedData = loginSchema.parse(body);

    const clinic = await this.authService.validateClinic(validatedData);
    return this.authService.login(clinic);
  }
}