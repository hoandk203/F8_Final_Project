import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/module';
import { StoreModule } from './store/module';

@Module({
  imports: [VendorModule, StoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
