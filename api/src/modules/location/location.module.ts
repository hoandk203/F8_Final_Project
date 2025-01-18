import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import {locationProviders} from "./location.providers";
import {DatabaseModule} from "../../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [LocationController],
  providers: [
    ...locationProviders,
    LocationService
  ],
})
export class LocationModule {}
