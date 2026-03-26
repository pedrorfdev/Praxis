import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  console.log('🏗️  Inicializando NestFactory...')
  const app = await NestFactory.create(AppModule)

  console.log('🛠️  Configurando Prefixo, CORS e Swagger...')
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })

  const config = new DocumentBuilder()
    .setTitle('Praxis API')
    .setDescription(
      'Sistema de gestão para clínicas e profissionais independentes',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o token JWT aqui',
        in: 'header',
      },
      'access-token',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api/docs', app, document)

  console.log('📡  Tentando abrir a porta 3333...')
  await app.listen(process.env.PORT ?? 3333)

  console.log('🚀 API Praxis is running on: http://localhost:3333/api')
  console.log('📑 Swagger Docs: http://localhost:3333/api/docs')
}
bootstrap().catch((err) => {
  console.error('💥 Erro fatal no bootstrap:', err)
})
