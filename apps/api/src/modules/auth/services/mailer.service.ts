import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter
  private logger = new Logger('MailerService')

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  async sendPasswordResetEmail(
    email: string,
    clinicName: string,
    resetToken: string
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@praxis.com',
      to: email,
      subject: '[Praxis] Recupere sua senha',
      html: `
        <h1>Olá ${clinicName},</h1>
        <p>Você solicitou a recuperação de sua senha. Clique no link abaixo para redefinir:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #7c3aed; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0;">
          Redefinir Senha
        </a>
        <p>Ou copie e cole este link no seu navegador:</p>
        <p><code>${resetLink}</code></p>
        <p>Este link expira em 1 hora.</p>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
        <hr />
        <small>Praxis - Gestão Clínica</small>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Email de reset enviado para ${email}`)
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${email}:`, error)
      throw error
    }
  }
}
