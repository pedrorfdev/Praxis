import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name)
  private readonly smtpUser = process.env.SMTP_USER
  private readonly smtpPass = process.env.SMTP_PASS
  private readonly smtpFrom = process.env.SMTP_FROM || process.env.SMTP_USER
  private readonly frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  private readonly transporter: nodemailer.Transporter

  private transporterVerified = false

  constructor() {
    this.transporter = nodemailer.createTransport(this.buildTransportOptions())

    if (!this.smtpUser || !this.smtpPass) {
      this.logger.warn(
        'SMTP_USER/SMTP_PASS nao configurados. Forgot password vai gerar token, mas envio de email vai falhar.',
      )
    }
  }

  private buildTransportOptions(): nodemailer.TransportOptions {
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || '587')
    const secure = process.env.SMTP_SECURE === 'true'
    const service = process.env.SMTP_SERVICE

    const auth =
      this.smtpUser && this.smtpPass
        ? {
            user: this.smtpUser,
            pass: this.smtpPass,
          }
        : undefined

    if (host) {
      return {
        host,
        port,
        secure,
        auth,
      }
    }

    return {
      service: service || 'gmail',
      auth,
    }
  }

  private async ensureTransportReady() {
    if (this.transporterVerified) {
      return
    }

    if (!this.smtpUser || !this.smtpPass) {
      throw new Error('SMTP_USER/SMTP_PASS ausentes no ambiente.')
    }

    try {
      await this.transporter.verify()
      this.transporterVerified = true
      this.logger.log('SMTP verificado com sucesso.')
    } catch (error: any) {
      this.logger.error(
        `Falha na verificacao SMTP: ${error?.message || 'erro desconhecido'}`,
      )
      if (error?.code) {
        this.logger.error(`SMTP code=${error.code} response=${error.response || '-'}`)
      }
      throw error
    }
  }

  async sendPasswordResetEmail(
    email: string,
    clinicName: string,
    resetToken: string,
  ): Promise<void> {
    await this.ensureTransportReady()

    const resetLink = `${this.frontendUrl}/reset-password?token=${resetToken}`
    const mailOptions = {
      from: this.smtpFrom ? `"Praxis" <${this.smtpFrom}>` : '"Praxis" <no-reply@praxis.local>',
      to: email,
      subject: 'Recuperacao de senha - Praxis',
      html: this.buildResetEmailTemplate(clinicName, resetLink),
    }

    try {
      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Email de reset enviado para ${email}`)
    } catch (error: any) {
      this.logger.error(`Erro ao enviar email para ${email}: ${error?.message || 'erro desconhecido'}`)
      if (error?.code) {
        this.logger.error(`SMTP code=${error.code} response=${error.response || '-'}`)
      }
      throw error
    }
  }

  private buildResetEmailTemplate(clinicName: string, resetLink: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperacao de Senha</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
          <tr>
            <td style="background: linear-gradient(135deg, #2a6b73 0%, #3d8f99 50%, #48b0bc 100%); padding: 40px 40px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                Praxis
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
                Gestao Clinica
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #1a2e35; font-size: 20px; font-weight: 700;">
                Ola, ${clinicName}
              </h2>
              <p style="margin: 0 0 24px; color: #5a7a84; font-size: 15px; line-height: 1.6;">
                Recebemos uma solicitacao para redefinir a senha da sua conta. Clique no botao abaixo para criar uma nova senha:
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 32px;">
                    <a href="${resetLink}"
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #2a6b73, #48b0bc); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 700; letter-spacing: 0.3px; box-shadow: 0 4px 16px rgba(42, 107, 115, 0.3);">
                      Redefinir minha senha
                    </a>
                  </td>
                </tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e8eef1; margin: 0 0 24px;" />
              <p style="margin: 0 0 12px; color: #8aa3ad; font-size: 13px; line-height: 1.5;">
                Ou copie e cole este link no seu navegador:
              </p>
              <p style="margin: 0 0 24px; padding: 12px 16px; background-color: #f5f8fa; border-radius: 8px; border: 1px solid #e2eaee;">
                <a href="${resetLink}" style="color: #2a6b73; font-size: 12px; word-break: break-all; text-decoration: none;">
                  ${resetLink}
                </a>
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #fefaf0; border-radius: 8px; border: 1px solid #f0e6cc;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="margin: 0; color: #8a7340; font-size: 13px; line-height: 1.5;">
                      Este link expira em <strong>1 hora</strong>. Se voce nao solicitou a redefinicao, ignore este e-mail com seguranca.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center; border-top: 1px solid #eef2f5;">
              <p style="margin: 0; color: #a3b8c2; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Praxis - Gestao Clinica
              </p>
              <p style="margin: 4px 0 0; color: #c4d4dc; font-size: 11px;">
                Este e um e-mail automatico, nao responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
}
