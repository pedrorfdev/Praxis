import { Inject, Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { LoginInput, ForgotPasswordInput, ResetPasswordInput } from '@praxis/core/domain'
import * as bcrypt from 'bcryptjs'
import * as crypto from 'crypto'
import { ClinicsRepository } from '../clinics/clinics.repository'
import { PasswordResetTokenRepository } from './repositories/password-reset-token.repository'
import { MailerService } from './services/mailer.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(ClinicsRepository)
    private readonly clinicsRepository: ClinicsRepository,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(PasswordResetTokenRepository)
    private readonly passwordResetTokenRepository: PasswordResetTokenRepository,
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  async validateClinic(data: LoginInput) {
    try {
      const clinic = await this.clinicsRepository.findByEmail(data.email)

      if (clinic && (await bcrypt.compare(data.password, clinic.password))) {
        const { password, ...result } = clinic
        return result
      }

      throw new UnauthorizedException('Credenciais inválidas')
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error
      this.logger.error(`Erro ao validar clínica: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao processar validação.')
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

  async forgotPassword(data: ForgotPasswordInput): Promise<{ message: string }> {
    try {
      const clinic = await this.clinicsRepository.findByEmail(data.email)

      // Sempre retorna mensagem genérica por segurança
      if (clinic) {
        try {
          const token = crypto.randomBytes(32).toString('hex')
          const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
          const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hora

          await this.passwordResetTokenRepository.create(
            clinic.id,
            tokenHash,
            expiresAt
          )

          await this.mailerService.sendPasswordResetEmail(
            clinic.email,
            clinic.name,
            token
          )
        } catch (error: any) {
          // Log do erro mas não expõe ao client
          this.logger.error(`Erro ao gerar/enviar token de redefinição: ${error.message}`, error.stack)
        }
      }

      // Sempre retorna a mesma mensagem
      return {
        message: 'Se o e-mail existir, você receberá as instruções.',
      }
    } catch (error: any) {
      this.logger.error(`Erro ao processar forgot password: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao solicitar recuperação.')
    }
  }

  async resetPassword(data: ResetPasswordInput): Promise<{ message: string }> {
    try {
      const tokenHash = crypto.createHash('sha256').update(data.token).digest('hex')

      const resetToken = await this.passwordResetTokenRepository.findByTokenHash(
        tokenHash
      )

      if (!resetToken) {
        throw new BadRequestException('Token inválido ou expirado')
      }

      if (resetToken.usedAt) {
        throw new BadRequestException('Este token já foi utilizado')
      }

      if (new Date() > resetToken.expiresAt) {
        throw new BadRequestException('Token expirado')
      }

      const clinic = await this.clinicsRepository.findById(resetToken.clinicId)

      if (!clinic) {
        throw new BadRequestException('Clínica não encontrada')
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)

      await this.clinicsRepository.update(clinic.id, {
        password: hashedPassword,
        updatedAt: new Date(),
      })

      await this.passwordResetTokenRepository.markAsUsed(resetToken.id)

      return { message: 'Senha redefinida com sucesso' }
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error
      this.logger.error(`Erro ao redefinir senha: ${error.message}`, error.stack)
      throw new InternalServerErrorException('Erro interno ao redefinir senha.')
    }
  }

  async validateToken(clinic: any) {
    return clinic
  }
}
