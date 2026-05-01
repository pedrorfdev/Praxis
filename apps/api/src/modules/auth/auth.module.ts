import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { ClinicsModule } from '../clinics/clinics.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt-strategy'
import { MailerService } from './services/mailer.service'
import { PasswordResetTokenRepository } from './repositories/password-reset-token.repository'

@Module({
  imports: [
    ClinicsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'chave-secreta-praxis',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, JwtStrategy, MailerService, PasswordResetTokenRepository],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
