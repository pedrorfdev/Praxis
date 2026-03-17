import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/infra/database/database.module";
import { ClinicsController } from "./clinics.controller";
import { ClinicsService } from "./clinics.service";
import { ClinicsRepository } from "./clinics.repository";

@Module({
  imports: [ DatabaseModule ],
  controllers: [ ClinicsController],
  providers: [ ClinicsService, ClinicsRepository ],
  exports: [ ClinicsService ]
})
export class ClinicsModule {}