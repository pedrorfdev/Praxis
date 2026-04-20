import { Module } from '@nestjs/common'
import { EncountersController } from './encounters.controller'
import { EncountersRepository } from './encounters.repository'
import { EncountersService } from './encounters.service'

@Module({
  controllers: [EncountersController],
  providers: [EncountersService, EncountersRepository],
})
export class EncountersModule {}
