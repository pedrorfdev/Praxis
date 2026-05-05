import { Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards/jwt-auth-guard'
import { AuthModule } from './modules/auth/auth.module'
import { ClinicsModule } from './modules/clinics/clinics.module'
import { HealthModule } from './modules/health/health.module'
import { PatientsModule } from './modules/patients/patients.module'
import { EncountersModule } from './modules/encounters/encounters.module'
import { CaregiversModule } from './modules/caregivers/caregivers.module'
import { MailerModule } from '@nestjs-modules/mailer'

@Module({
  imports: [
    HealthModule,
    AuthModule,
    ClinicsModule,
    PatientsModule,
    EncountersModule,
    CaregiversModule,
    MailerModule.forRoot({
      transport: process.env.SMTP,
      defaults: {
        from: `"praxis" <${process.env.EMAIL_USER}>`,
      }
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
  ],
})
export class AppModule { }
