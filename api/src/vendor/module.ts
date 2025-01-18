import { Module } from '@nestjs/common';
import { VendorController } from './controller';
import { VendorService } from './service';
import {vendorProviders} from "./vendor.providers";
import {DatabaseModule} from "../database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [VendorController],
  providers: [
      ...vendorProviders,
      VendorService
  ],
})
export class VendorModule {}
