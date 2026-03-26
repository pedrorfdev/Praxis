import { Module } from '@nestjs/common'
import { ClinicsController } from './clinics.controller'
import { ClinicsRepository } from './clinics.repository'
import { ClinicsService } from './clinics.service'

@Module({
  imports: [],
  controllers: [ClinicsController],
  providers: [ClinicsService, ClinicsRepository],
  exports: [ClinicsService, ClinicsRepository],
})
export class ClinicsModule {}
