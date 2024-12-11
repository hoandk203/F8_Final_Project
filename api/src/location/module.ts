import { Module } from '@nestjs/common';
import { LocationController } from './controller';
import { LocationService } from './service';
import {locationProviders} from "./location.providers";
import {DatabaseModule} from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [LocationController],
  providers: [
      ...locationProviders,
      LocationService
  ],
})
export class LocationModule {}
