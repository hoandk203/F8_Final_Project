import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import {DatabaseModule} from "../../database.module";
import {driverProviders} from "./driver.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [DriverController],
  providers: [
      ...driverProviders,
      DriverService
  ],
})
export class DriverModule {}
