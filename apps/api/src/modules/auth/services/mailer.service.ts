import { Injectable, Logger } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter
  private logger = new Logger('MailerService')

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
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
      from: `"Praxis" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Recuperação de Senha — Praxis',
      html: this.buildResetEmailTemplate(clinicName, resetLink),
    }

    try {
      await this.transporter.sendMail(mailOptions)
      this.logger.log(`Email de reset enviado para ${email}`)
    } catch (error) {
      this.logger.error(`Erro ao enviar email para ${email}:`, error)
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
  <title>Recuperação de Senha</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f4f8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #2a6b73 0%, #3d8f99 50%, #48b0bc 100%); padding: 40px 40px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">
                Praxis
              </h1>
              <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-weight: 600;">
                Gestão Clínica
              </p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 8px; color: #1a2e35; font-size: 20px; font-weight: 700;">
                Olá, ${clinicName}
              </h2>
              <p style="margin: 0 0 24px; color: #5a7a84; font-size: 15px; line-height: 1.6;">
                Recebemos uma solicitação para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha:
              </p>
              
              <!-- CTA Button -->
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
              
              <!-- Divider -->
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
                      ⏱ Este link expira em <strong>1 hora</strong>. Se você não solicitou a redefinição, ignore este e-mail com segurança.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px 32px; text-align: center; border-top: 1px solid #eef2f5;">
              <p style="margin: 0; color: #a3b8c2; font-size: 12px;">
                © ${new Date().getFullYear()} Praxis — Gestão Clínica
              </p>
              <p style="margin: 4px 0 0; color: #c4d4dc; font-size: 11px;">
                Este é um e-mail automático, não responda.
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
