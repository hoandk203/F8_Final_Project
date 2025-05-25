import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto {
    @ApiProperty({
        description: 'Payment ID',
        example: 1
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        description: 'Order ID',
        example: 1
    })
    @IsNumber()
    orderId: number;

    @ApiProperty({
        description: 'Payment amount',
        example: 100000
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'Payment status',
        enum: PaymentStatus
    })
    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod
    })
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @ApiProperty({
        description: 'Transaction ID',
        example: 'trans_123456',
        required: false
    })
    @IsString()
    @IsOptional()
    transactionId?: string;

    @ApiProperty({
        description: 'Transaction reference',
        example: 'ref_123456',
        required: false
    })
    @IsString()
    @IsOptional()
    transactionRef?: string;

    @ApiProperty({
        description: 'Payment URL',
        example: 'https://payment.example.com/pay',
        required: false
    })
    @IsString()
    @IsOptional()
    paymentUrl?: string;

    @ApiProperty({
        description: 'Created date'
    })
    @IsDate()
    createdAt: Date;

    @ApiProperty({
        description: 'Updated date'
    })
    @IsDate()
    updatedAt: Date;
} 