import { Module } from '@nestjs/common';
import { VendorController } from './controller';
import { VendorService } from './service';

@Module({
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
