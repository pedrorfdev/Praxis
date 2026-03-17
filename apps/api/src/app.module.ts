import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { ClinicsModule } from './modules/clinics/clinics.module';

@Module({
  imports: [
    DatabaseModule,
    ClinicsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}