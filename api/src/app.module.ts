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
import { UsersModule } from './modules/users/users.module';
import {OtpModule} from "./modules/email-verification/otp.module";
import { AuthModule } from './modules/auth/auth.module';
import {RefreshTokenModule} from "./modules/refresh-token/refresh-token.module";
import {ConfigModule} from "@nestjs/config";
import { IdentityDocumentModule } from './modules/identity-document/identity-document.module';
import { DriverModule } from './modules/driver/driver.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import {StoreLocationModule} from "./modules/store-location/store-location.module";

@Module({
  imports: [
      ConfigModule.forRoot(),
      StoreModule,
      VendorModule,
      ImageModule,
      LocationModule,
      MaterialModule,
      OrderModule,
      OrderDetailModule,
      UsersModule,
      OtpModule,
      AuthModule,
      RefreshTokenModule,
      IdentityDocumentModule,
      DriverModule,
      VehicleModule,
      StoreLocationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
