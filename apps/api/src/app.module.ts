import { Module } from '@nestjs/common'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { JwtAuthGuard } from './common/guards/jwt-auth-guard'
import { AuthModule } from './modules/auth/auth.module'
import { ClinicsModule } from './modules/clinics/clinics.module'
import { HealthModule } from './modules/health/health.module'
import { PatientsModule } from './modules/patients/patients.module'
import { EncountersModule } from './modules/encounters/encounters.module'

@Module({
  imports: [
    HealthModule,
    AuthModule,
    ClinicsModule,
    PatientsModule,
    EncountersModule,
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
export class AppModule {}
