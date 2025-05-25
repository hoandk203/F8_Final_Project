import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Matches, ValidateNested } from 'class-validator';

export enum OrderStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    ON_MOVING = 'on moving',
    COMPLETED = 'completed',
    CANCELED = 'canceled'
}

export class OrderDetailDto {
    @ApiProperty({
        description: 'Material ID',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    materialId: number;

    @ApiProperty({
        description: 'Weight in kg',
        example: 10.5
    })
    @IsNumber()
    @IsNotEmpty()
    weight: number;

    @ApiProperty({
        description: 'Amount calculated from weight and material price',
        example: 1000
    })
    @IsNumber()
    @IsOptional()
    amount?: number;
}

export class CreateDto {
    @ApiProperty({
        description: 'Store ID',
        example: 1
    })
    @IsNumber()
    @IsOptional()
    storeId?: number;

    @ApiProperty({
        description: 'Order status',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @ApiProperty({
        description: 'Scrap image in base64 format',
        example: 'data:image/jpeg;base64,...'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Scrap image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    scrapImage: string;

    @ApiProperty({
        description: 'Order details array',
        type: [OrderDetailDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDetailDto)
    orderDetails: OrderDetailDto[];

    @ApiProperty({
        description: 'Note for the order',
        example: 'Please handle with care',
        required: false
    })
    @IsString()
    @IsOptional()
    note?: string;
}

export class UpdateDto {
    @ApiProperty({
        description: 'Order status',
        enum: OrderStatus
    })
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: OrderStatus;

    @ApiProperty({
        description: 'Proof image in base64 format',
        example: 'data:image/jpeg;base64,...',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Proof image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    proofImage?: string;
}
