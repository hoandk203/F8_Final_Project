import { Module } from '@nestjs/common';
import {orderDetailController} from './controller';
import {OrderDetailService} from './service';
import {orderDetailProviders} from "./orderDetail.providers";
import {DatabaseModule} from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [orderDetailController],
  providers: [
      ...orderDetailProviders,
      OrderDetailService
  ],
})
export class OrderDetailModule {}
