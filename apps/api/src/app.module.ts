import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core'
import { ClinicsModule } from './modules/clinics/clinics.module';
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';
import { HealthModule } from './modules/health/health.module';
import { PatientsModule } from './modules/patients/patients.module';
import { SessionsModule } from './modules/sessions/sessions.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
    ClinicsModule,
    PatientsModule,
    SessionsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => {
        return new JwtAuthGuard(reflector);
      },
      inject: [Reflector],
    },
  ],
})
export class AppModule {}