import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { orderProviders } from "./order.providers";
import { DatabaseModule } from "../../database.module";
import { OrderDetailModule } from '../order-detail/order-detail.module';
import { MaterialModule } from '../material/material.module';
import { StoreModule } from '../store/store.module';
import { StoreLocationModule } from '../store-location/store-location.module';
import { DriverModule } from '../driver/driver.module';
@Module({
  imports: [
    DatabaseModule,
    OrderDetailModule,
    MaterialModule,
    StoreLocationModule,
    StoreModule,
    DriverModule
  ],
  controllers: [OrderController],
  providers: [
    ...orderProviders,
    OrderService
  ],
  exports: [OrderService]
})
export class OrderModule {}
