import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { paymentProviders } from './payment.providers';
import { DatabaseModule } from '../../database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
  ],
  controllers: [PaymentController],
  providers: [
    ...paymentProviders,
    PaymentService,
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
