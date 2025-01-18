import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/module';
import {ImageModule} from "./image/module";
import {LocationModule} from "./location/module";
import {MaterialModule} from "./material/module";
import {OrderModule} from "./order/module";
import {OrderDetailModule} from "./orderDetail/module";
import {StoreModule} from "./store/module";

@Module({
  imports: [StoreModule, VendorModule, ImageModule, LocationModule, MaterialModule, OrderModule, OrderDetailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
