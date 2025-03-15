import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto {
    id: number;
    orderId: number;
    amount: number;
    status: PaymentStatus;
    method: PaymentMethod;
    transactionId?: string;
    transactionRef?: string;
    paymentUrl?: string;
    createdAt: Date;
    updatedAt: Date;
} 