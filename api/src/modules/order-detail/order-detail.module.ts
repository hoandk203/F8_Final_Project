import { Module } from '@nestjs/common';
import { OrderDetailController } from './order-detail.controller';
import { OrderDetailService } from './order-detail.service';
import { orderDetailProviders } from "./order-detail.providers";
import { DatabaseModule } from "../../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [OrderDetailController],
  providers: [
    ...orderDetailProviders,
    OrderDetailService
  ],
  exports: [OrderDetailService]
})
export class OrderDetailModule {}
