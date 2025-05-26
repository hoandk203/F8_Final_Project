import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreatePaymentDto {
    @ApiProperty({
        description: 'Order ID',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    orderId: number;

    @ApiProperty({
        description: 'Payment amount',
        example: 100000
    })
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        return value;
    })
    @IsNumber()
    amount: number;

    @ApiProperty({
        description: 'Payment method',
        enum: PaymentMethod,
        example: PaymentMethod.VNPAY
    })
    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @ApiProperty({
        description: 'Return URL after payment',
        example: 'https://example.com/return',
        required: false
    })
    @IsOptional()
    @IsString()
    returnUrl?: string;
} 