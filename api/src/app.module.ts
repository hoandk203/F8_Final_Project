import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './modules/vendor/vendor.module';
import { StoreModule } from './modules/store/store.module';
import { ImageModule } from './modules/image/image.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailModule } from './modules/order-detail/order-detail.module';
import { LocationModule } from './modules/location/location.module';
import { MaterialModule } from './modules/material/material.module';

@Module({
  imports: [StoreModule, VendorModule, ImageModule, LocationModule, MaterialModule, OrderModule, OrderDetailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
