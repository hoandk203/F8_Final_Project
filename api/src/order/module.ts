import { Module } from '@nestjs/common';
import {OrderController} from './controller';
import { OrderService } from './service';
import {orderProviders} from "./order.providers";
import {DatabaseModule} from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [
      ...orderProviders,
      OrderService
  ],
})
export class OrderModule {}
