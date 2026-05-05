export const templateHTML = (name: string, token: string) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  const resetLink = `${frontendUrl}/reset-password?token=${token}`

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperação de Senha - Praxis</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #f8fafc;
      padding: 40px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%);
      padding: 48px 40px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .content {
      padding: 48px 40px;
    }
    .content h2 {
      margin-top: 0;
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
      margin-bottom: 32px;
    }
    .button-container {
      text-align: center;
      margin-bottom: 32px;
    }
    .button {
      display: inline-block;
      padding: 16px 32px;
      background-color: #0f766e;
      color: #ffffff;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: background-color 0.2s;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 32px 40px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
    .footer p {
      margin: 4px 0;
    }
    .link-copy {
      font-size: 12px;
      color: #94a3b8;
      word-break: break-all;
      margin-top: 24px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Praxis</h1>
      </div>
      <div class="content">
        <h2>Olá, ${name}</h2>
        <p>Recebemos uma solicitação para redefinir a sua senha. Clique no botão abaixo para criar uma nova senha de acesso:</p>
        <div class="button-container">
          <a href="${resetLink}" class="button">Redefinir Senha</a>
        </div>
        <p>Se você não solicitou essa alteração, pode ignorar este e-mail com segurança.</p>
        <div class="link-copy">
          Se o botão acima não funcionar, copie e cole o link abaixo no seu navegador:<br>
          ${resetLink}
        </div>
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Praxis - Terapia Ocupacional</p>
        <p>Este é um e-mail automático, por favor não responda.</p>
      </div>
    </div>
  </div>
</body>
</html>
`
}
