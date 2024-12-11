import { Module } from '@nestjs/common';
import { StoreController } from './controller';
import { StoreService } from './service';
import {DatabaseModule} from "../database.module";
import {storeProviders} from "./store.providers";

@Module({
  imports: [DatabaseModule],
  controllers: [StoreController],
  providers: [
    ...storeProviders,
    StoreService
  ],
})

export class StoreModule {}
