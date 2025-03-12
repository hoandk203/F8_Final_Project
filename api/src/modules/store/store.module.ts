import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import {DatabaseModule} from "../../database.module";
import {storeProviders} from "./store.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [StoreController],
  providers: [
    ...storeProviders,
    StoreService
  ],
  exports: [StoreService]
})

export class StoreModule {}
