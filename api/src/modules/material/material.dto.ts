import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    description: 'Name of material',
    example: 'iron'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Price per unit',
    example: 100
  })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}

export class UpdateDto {
  @ApiProperty({
    description: 'Name of material',
    example: 'iron'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Price per unit',
    example: 100
  })
  @IsNumber()
  @IsNotEmpty()
  unitPrice: number;
}
