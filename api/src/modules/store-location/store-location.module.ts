import { Module } from '@nestjs/common';
import { StoreLocationController } from './store-location.controller';
import { StoreLocationService } from './store-location.service';
import {storeLocationProviders} from "./store-location.providers";
import {DatabaseModule} from "../../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [StoreLocationController],
  providers: [
    ...storeLocationProviders,
    StoreLocationService
  ],
  exports: [StoreLocationService]
})
export class StoreLocationModule {}
