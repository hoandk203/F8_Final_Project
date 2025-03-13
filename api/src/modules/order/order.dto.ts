import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class OrderDetailDto {
  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  materialId: number;

  @ApiProperty({
    default: 10,
  })
  @IsNumber()
  weight: number;

  @ApiProperty({
    default: 1000,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;
}

class CreateDto {
  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  storeId?: number;

  @ApiProperty({
    default: "pending",
  })
  @IsString()
  @IsOptional()
  status?: string;
  
  @ApiProperty({
    default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  })
  @IsString()
  @IsNotEmpty()
  scrapImage: string;

  @ApiProperty({
    type: [OrderDetailDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  orderDetails: OrderDetailDto[];
}

class UpdateDto {
  @ApiProperty({
    default: "completed",
  })
  @IsString()
  @IsOptional()
  status?: string;
}

export { CreateDto, UpdateDto, OrderDetailDto };
