import { Module } from '@nestjs/common';
import {orderDetailController} from './order-detail.controller';
import {OrderDetailService} from './order-detail.service';
import {orderDetailProviders} from "./order-detail.providers";
import {DatabaseModule} from "../../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [orderDetailController],
  providers: [
    ...orderDetailProviders,
    OrderDetailService
  ],
})
export class OrderDetailModule {}
