import { Controller, Get, Post, Body, Param, Query, Res, Logger, BadRequestException, NotFoundException, Put } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VnpayCallbackDto } from './dto/vnpay-callback.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);
  
  constructor(
    private readonly paymentService: PaymentService,
    private configService: ConfigService,
  ) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: any) {
    return this.paymentService.update(Number(id), updatePaymentDto.paymentUrl);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Get('vnpay-callback')
  async handleVnpayCallback(
    @Query() callbackParams: VnpayCallbackDto,
    @Query('returnUrl') returnUrl: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Received VNPay callback with params: ${JSON.stringify(callbackParams)}`);
    
    try {
      const payment = await this.paymentService.handleVnpayCallback(callbackParams);
      
      let redirectUrl = returnUrl || '/driver/payment-result';
      
      if (!redirectUrl.startsWith('http')) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5000';
        redirectUrl = `${frontendUrl}${redirectUrl}`;
      }
      
      const orderId = payment.orderId ? Number(payment.orderId) : null;

      if (!orderId) {
        this.logger.error(`Invalid orderId while redirecting: ${payment.orderId}`);
      }

      if (redirectUrl.includes('?')) {
        redirectUrl += `&status=${payment.status}&orderId=${orderId || ''}`;
      } else {
        redirectUrl += `?status=${payment.status}&orderId=${orderId || ''}`;
      }
      
      this.logger.log(`Redirecting to: ${redirectUrl}`);
      return res.redirect(redirectUrl);
    } catch (error) {
      this.logger.error(`Error in VNPay callback: ${error.message}`, error.stack);
      
      let errorRedirectUrl = returnUrl || '/driver/payment-result';
      
      if (!errorRedirectUrl.startsWith('http')) {
        const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5000';
        errorRedirectUrl = `${frontendUrl}${errorRedirectUrl}`;
      }
      
      const encodedMessage = encodeURIComponent(error.message || 'error while processing payment');
      
      let finalErrorUrl = errorRedirectUrl;
      if (finalErrorUrl.includes('?')) {
        finalErrorUrl += `&status=error&message=${encodedMessage}`;
      } else {
        finalErrorUrl += `?status=error&message=${encodedMessage}`;
      }
      
      this.logger.log(`Redirecting to error URL: ${finalErrorUrl}`);
      return res.redirect(finalErrorUrl);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paymentId = parseInt(id);
    if (isNaN(paymentId) || paymentId <= 0) {
      throw new BadRequestException(`Invalid payment ID: ${id}`);
    }
    return this.paymentService.findOne(paymentId);
  }

  @Get('order/:orderId')
  async findByOrderId(@Param('orderId') orderId: string) {
    const orderIdNum = Number(orderId);
    if (!orderId || isNaN(orderIdNum) || orderIdNum <= 0) {
      this.logger.error(`Invalid order ID received: ${orderId}`);
      throw new BadRequestException(`Invalid order ID: ${orderId}`);
    }
    return this.paymentService.findByOrderId(orderIdNum);
  }

  @Get('driver/:driverId/unpaid')
  async getUnpaidPaymentsByDriver(@Param('driverId') driverId: string) {
    const driverIdNum = Number(driverId);
    
    if (!driverId || isNaN(driverIdNum) || driverIdNum <= 0) {
      this.logger.error(`Invalid driver ID received: ${driverId}`);
      throw new BadRequestException(`Invalid driver ID: ${driverId}`);
    }
    return this.paymentService.getUnpaidPaymentsByDriver(driverIdNum);
  }
}
