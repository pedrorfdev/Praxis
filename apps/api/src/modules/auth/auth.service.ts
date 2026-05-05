import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type {
  CreateClinicInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
} from '@praxis/core/domain'
import * as bcrypt from 'bcryptjs'
import { ClinicsRepository } from '../clinics/clinics.repository'
import { MailerService } from '@nestjs-modules/mailer'
import { templateHTML } from './utils/templateHTML'

@Injectable()
export class AuthService {
  constructor(
    @Inject(ClinicsRepository)
    private readonly clinicsRepository: ClinicsRepository,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject(MailerService)
    private readonly mailerService: MailerService,
  ) {}

  async generateJwtToken(clinic: any, expiresIn: any = '7d') {
    const payload = {
      sub: clinic.id,
      name: clinic.name,
      email: clinic.email,
      clinicId: clinic.id,
    }

    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn,
        issuer: 'praxis',
        audience: 'clinics',
      }),
    }
  }

  async login({ email, password }: LoginInput) {
    const clinic = await this.clinicsRepository.findByEmail(email)

    if (!clinic || !(await bcrypt.compare(password, clinic.password))) {
      throw new UnauthorizedException('Email ou senha incorretos')
    }

    return this.generateJwtToken(clinic)
  }

  async register(body: CreateClinicInput & { slug: string }) {
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const clinic = await this.clinicsRepository.create({
      ...body,
      password: hashedPassword,
    })

    return this.generateJwtToken(clinic)
  }

  async resetPassword({ token, password }: ResetPasswordInput) {
    const { valid, decoded } = await this.validateToken(token)

    if (!valid) {
      throw new UnauthorizedException('Token inválido ou expirado')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const clinic = await this.clinicsRepository.update(decoded.sub, {
      password: hashedPassword,
      updatedAt: new Date(),
    })

    return this.generateJwtToken(clinic)
  }

  async forgotPassword(data: ForgotPasswordInput) {
    const clinic = await this.clinicsRepository.findByEmail(data.email)

    if (!clinic) {
      // Mantém resposta genérica por segurança ou lança se preferir
      throw new UnauthorizedException('E-mail não encontrado')
    }

    const tokenData = await this.generateJwtToken(clinic, '1h')

    await this.mailerService.sendMail({
      to: clinic.email,
      subject: 'Recuperação de Senha - Praxis',
      html: templateHTML(clinic.name, tokenData.access_token),
    })

    return {
      message: 'Se o e-mail existir, você receberá as instruções.',
    }
  }

  async validateToken(token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'chave-secreta-praxis',
        issuer: 'praxis',
        audience: 'clinics',
      })

      return { valid: true, decoded }
    } catch (error: any) {
      return { valid: false, message: error.message }
    }
  }
}

