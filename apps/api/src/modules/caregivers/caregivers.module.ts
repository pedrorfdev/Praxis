import { Module } from '@nestjs/common'
import { CaregiversController } from './caregivers.controller'
import { CaregiversRepository } from './caregivers.repository'
import { CaregiversService } from './caregivers.service'

@Module({
  controllers: [CaregiversController],
  providers: [CaregiversService, CaregiversRepository],
  exports: [CaregiversService],
})
export class CaregiversModule {}
