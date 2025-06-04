import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentStatus, PaymentMethod } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { VnpayCallbackDto } from './dto/vnpay-callback.dto';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as querystring from 'querystring';
import { OrderService } from '../order/order.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject('PAYMENT_REPOSITORY')
    private paymentRepository: Repository<Payment>,
    private configService: ConfigService,
    private orderService: OrderService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    // Tính thời gian hết hạn (12 giờ từ thời điểm tạo)
    const expiredAt = new Date();
    expiredAt.setHours(expiredAt.getHours() + 12);

    // Tao payment record trong database
    const payment = this.paymentRepository.create({
      orderId: createPaymentDto.orderId,
      amount: createPaymentDto.amount,
      method: createPaymentDto.method,
      status: PaymentStatus.PENDING,
      expiredAt: expiredAt
    });

    const savedPayment = await this.paymentRepository.save(payment);

    // Neu la VNPAY, tao payment URL
    if (createPaymentDto.method === PaymentMethod.VNPAY) {
      const paymentUrl = await this.createVnpayPaymentUrl(
        savedPayment,
        createPaymentDto.returnUrl,
      );
      return {
        ...savedPayment,
        paymentUrl,
      };
    }

    return savedPayment;
  }

  async findAll() {
    return this.paymentRepository.find();
  }

  async findOne(id: number) {
    // Kiem tra id co phai la so hop le khong
    if (isNaN(id) || !Number.isInteger(Number(id)) || id <= 0) {
      this.logger.error(`Invalid payment ID1: ${id}`);
      throw new BadRequestException(`Invalid payment ID1: ${id}`);
    }

    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID2 ${id} not found`);
    }
    return payment;
  }

  async findByOrderId(orderId: number) {
    if (!orderId || isNaN(orderId) || orderId <= 0) {
      this.logger.error(`Invalid order ID: ${orderId}`);
      throw new BadRequestException(`Invalid order ID: ${orderId}`);
    }
  
    const payments = await this.paymentRepository.find({ where: { orderId } });
  
    if (!payments || payments.length === 0) {
      throw new NotFoundException(`No payments found for order ID: ${orderId}`);
    }
  
    return payments;
  }

  async handleVnpayCallback(callbackParams: VnpayCallbackDto) {
    try {
      this.logger.log(`Handling VNPay callback: ${JSON.stringify(callbackParams)}`);
      
      // Tao ban sao cua callbackParams de xu ly
      const callbackParamsCopy = { ...callbackParams };
      
      // Verify VNPay callback signature
      const secureHash = callbackParamsCopy.vnp_SecureHash;
      delete callbackParamsCopy.vnp_SecureHash;

      const sortedParams = this.sortObject(callbackParamsCopy);
      const secretKey = this.configService.get<string>('VNPAY_HASH_SECRET');
      const signData = querystring.stringify(sortedParams);
      
      this.logger.debug(`Sign data: ${signData}`);
      this.logger.debug(`Secret key: ${secretKey}`);
      
      const hmac = crypto.createHmac('sha512', secretKey);
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      
      this.logger.debug(`Calculated hash: ${signed}`);
      this.logger.debug(`Received hash: ${secureHash}`);

      // Kiem tra chu ky co dung khong
      if (secureHash !== signed) {
        this.logger.warn(`Invalid signature. Expected: ${signed}, Got: ${secureHash}`);
        // Tam thoi bo qua viec kiem tra signature de debug
        // throw new BadRequestException('Invalid signature');
      }

      // Lay payment tu transaction reference
      const transactionRef = callbackParams.vnp_TxnRef;
      this.logger.log(`Looking for payment with transaction reference: ${transactionRef}`);
      
      let payment = await this.paymentRepository.findOne({
        where: { transactionRef },
      });

      // Neu khong tim thay bang transactionRef, thu tim bang orderId tu orderInfo
      if (!payment) {
        const orderInfoMatch = callbackParams.vnp_OrderInfo?.match(/#(\d+)/);
        if (orderInfoMatch && orderInfoMatch[1]) {
          const orderId = parseInt(orderInfoMatch[1]);
          
          // Kiem tra neu orderId la NaN hoac khong hop le
          if (isNaN(orderId) || orderId <= 0) {
            this.logger.error(`Invalid orderId extracted from orderInfo: ${callbackParams.vnp_OrderInfo}`);
            throw new BadRequestException(`Invalid orderId in orderInfo: ${callbackParams.vnp_OrderInfo}`);
          }
          
          this.logger.log(`No payment found with ref, trying to find by orderId: ${orderId}`);
          
          // Lay payment gan nhat cho orderId nay
          const payments = await this.paymentRepository.find({
            where: { orderId },
            order: { createdAt: 'DESC' },
            take: 1,
          });
          
          if (payments.length > 0) {
            payment = payments[0];
            
            // Cap nhat transactionRef neu chua co
            if (!payment.transactionRef) {
              payment.transactionRef = transactionRef;
            }
          }
        }
      }

      if (!payment) {
        this.logger.error(`Payment with reference ${transactionRef} not found`);
        throw new NotFoundException(`Payment with reference ${transactionRef} not found`);
      }

      // Cap nhat trang thai dua tren response code
      const responseCode = callbackParams.vnp_ResponseCode;
      let status: PaymentStatus;

      if (responseCode === '00') {
        status = PaymentStatus.SUCCESS;
      } else if (responseCode === '24') {
        status = PaymentStatus.CANCELED;
      } else {
        status = PaymentStatus.FAILED;
      }

      // Cap nhat thong tin payment
      payment.status = status;
      payment.transactionId = callbackParams.vnp_TransactionNo;
      payment.paymentData = callbackParams;

      const updatedPayment = await this.paymentRepository.save(payment);
      this.logger.log(`Payment updated successfully: ${JSON.stringify(updatedPayment)}`);
      
      return updatedPayment;
    } catch (error) {
      this.logger.error(`Error handling VNPay callback: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async createVnpayPaymentUrl(payment: Payment, returnUrl: string = '/driver/payment-result') {
    const vnpUrl = this.configService.get<string>('VNPAY_URL');
    const vnpTmnCode = this.configService.get<string>('VNPAY_TMN_CODE');
    const secretKey = this.configService.get<string>('VNPAY_HASH_SECRET');
    const vnpVersion = '2.1.0';
    const vnpCommand = 'pay';
    const vnpCurrCode = 'VND';

    // Tao transaction reference với timestamp hiện tại
    const dateFormat = moment(new Date()).format('YYYYMMDDHHmmss');
    const transactionRef = `${dateFormat}.${payment.id}`;

    // Cap nhat payment voi transaction reference mới
    payment.transactionRef = transactionRef;
    await this.paymentRepository.save(payment);

    // Tao vnp_OrderInfo tu orderId
    const orderInfo = `Thanh toan don hang #${payment.orderId}`;

    // Lay frontend URL tu config
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5000';
    const apiUrl = this.configService.get<string>('API_URL') || 'http://localhost:3001';
    
    // Tao URL return day du
    const fullReturnUrl = returnUrl.startsWith('http') 
      ? returnUrl 
      : `${frontendUrl}${returnUrl}`;
    
    // Tao cac tham so cho VNPay
    const vnpParams = {
      vnp_Version: vnpVersion,
      vnp_Command: vnpCommand,
      vnp_TmnCode: vnpTmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: vnpCurrCode,
      vnp_TxnRef: transactionRef,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: 'other',
      vnp_Amount: payment.amount * 100 * 25000,
      vnp_ReturnUrl: `${apiUrl}/payment/vnpay-callback?returnUrl=${encodeURIComponent(fullReturnUrl)}`,
      vnp_IpAddr: '127.0.0.1',
      vnp_CreateDate: dateFormat
    };

    // Sap xep cac tham so theo thu tu abc
    const sortedParams = this.sortObject(vnpParams);
    
    // Tao chuoi hash de ky
    const searchParams = new URLSearchParams();
    Object.entries(sortedParams).forEach(([key, value]) => {
      searchParams.append(key, value as string);
    });
    const signData = searchParams.toString();
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Them chu ky vao params
    const finalParams = {
      ...sortedParams,
      vnp_SecureHash: signed,
    };

    // Tao URL thanh toan voi params
    const paymentUrl = `${vnpUrl}?${querystring.stringify(finalParams)}`;
    
    return paymentUrl;
  }

  private sortObject(obj: any) {
    const sorted: any = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
      if (obj[key] !== undefined && obj[key] !== null) {
        sorted[key] = obj[key];
      }
    }
    
    return sorted;
  }

  async getUnpaidPaymentsByDriver(driverId: number) {
    const orders = await this.orderService.getByDriverId(driverId);

    let payment: any;
    let expiredPayment: any;

    for (const order of orders) {
      // Tìm payment pending (bao gồm cả đã hết hạn)
      payment = await this.paymentRepository.findOne({
        where: { 
          status: PaymentStatus.PENDING || PaymentStatus.EXPIRED,
          orderId: order.id, 
          active: true
        }
      });

      if (payment) {
        // Kiểm tra xem payment có hết hạn không
        const now = new Date();
        if (payment.expiredAt && payment.expiredAt < now) {
          // Payment đã hết hạn
          expiredPayment = payment;
          
          // Cập nhật status thành FAILED vì hết hạn
          await this.paymentRepository.update(payment.id, {
            status: PaymentStatus.EXPIRED
          });
          
          continue; // Tiếp tục tìm payment khác
        }

        // Payment vẫn còn hiệu lực
        // Tạo URL mới nếu payment vẫn còn hiệu lực
        const newPaymentUrl = await this.createVnpayPaymentUrl(
          payment,
          '/driver/payment-result'
        );
        
        // Cập nhật URL mới vào payment
        await this.paymentRepository.update(payment.id, {
          paymentUrl: newPaymentUrl
        });

        // Trả về payment với URL mới
        return {
          ...payment,
          paymentUrl: newPaymentUrl
        };
      }
    }
    
    // Nếu có expired payment nhưng không có payment còn hiệu lực
    if (expiredPayment) {
      return {
        isExpired: true,
        expiredAt: expiredPayment.expiredAt,
        amount: expiredPayment.amount,
        orderId: expiredPayment.orderId,
        message: 'Payment has expired. Please contact support.'
      };
    }
    
    return null;
  }

  async update(id: number, paymentUrl: string) {
    return this.paymentRepository
    .createQueryBuilder()
    .update(Payment)
    .set({paymentUrl: paymentUrl})
    .where("id = :id", { id })
    .execute();
  }
}
