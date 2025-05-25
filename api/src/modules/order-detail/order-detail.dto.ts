import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

class CreateDto {
  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @ApiProperty({
    default: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  materialId: number;

  @ApiProperty({
    default: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    default: 1000,
  })
  @IsNumber()
  @IsOptional()
  amount?: number;
}

class UpdateDto extends CreateDto {}

export { CreateDto, UpdateDto };
