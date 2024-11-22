import { Module } from '@nestjs/common';
import { StoreController } from './controller';
import { StoreService } from './service';

@Module({
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
