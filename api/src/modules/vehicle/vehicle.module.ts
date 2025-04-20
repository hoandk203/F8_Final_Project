import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import {DatabaseModule} from "../../database.module";
import {vehicleProviders} from "./vehicle.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [VehicleController],
  providers: [
      ...vehicleProviders,
      VehicleService
  ],
  exports: [VehicleService]
})
export class VehicleModule {}
