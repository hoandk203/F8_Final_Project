import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    description: 'Latitude of the store location',
    example: 10.123456
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the store location',
    example: 106.123456
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'ID of the store',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  storeId: number;
}

export class UpdateDto {
  @ApiProperty({
    description: 'Latitude of the store location',
    example: 10.123456
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the store location',
    example: 106.123456
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
