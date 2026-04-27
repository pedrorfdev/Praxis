import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { LoginInput } from '@praxis/core/domain'
import * as bcrypt from 'bcryptjs'
import { ClinicsRepository } from '../clinics/clinics.repository'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(ClinicsRepository)
    private readonly clinicsRepository: ClinicsRepository,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async validateClinic(data: LoginInput) {
    try {
      const clinic = await this.clinicsRepository.findByEmail(data.email)

      if (clinic && (await bcrypt.compare(data.password, clinic.password))) {
        const { password, ...result } = clinic
        return result
      }

      throw new UnauthorizedException('Credenciais invalidas')
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error
      this.logger.error(`Erro ao validar clinica: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao processar validacao.')
    }
  }

  async login(clinic: any) {
    try {
      const payload = {
        sub: clinic.id,
        email: clinic.email,
      }

      return {
        access_token: this.jwtService.sign(payload),
        clinic: {
          id: clinic.id,
          name: clinic.name,
        },
      }
    } catch (error: any) {
      this.logger.error(`Erro ao gerar token: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao gerar acesso.')
    }
  }

  async validateToken(clinic: any) {
    return clinic
  }
}
