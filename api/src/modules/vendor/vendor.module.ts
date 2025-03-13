import { Module } from '@nestjs/common';
import {vendorProviders} from "./vendor.providers";
import {DatabaseModule} from "../../database.module";
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
    imports: [DatabaseModule],
    controllers: [VendorController],
    providers: [
        ...vendorProviders,
        VendorService
    ],
    exports: [VendorService]
})
export class VendorModule {}
