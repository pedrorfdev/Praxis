import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ClinicsModule } from './modules/clinics/clinics.module';
import { HealthController } from './modules/health/health.controller';
import { JwtAuthGuard } from './common/guards/jwt-auth-guard';

@Module({
  imports: [
    DatabaseModule,
    ClinicsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
  ],
})
export class AppModule {}