import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    description: 'Latitude of the location',
    example: 10.123456
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: 106.123456
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty({
    description: 'ID of the driver',
    example: 1
  })
  @IsNumber()
  @IsNotEmpty()
  driverId: number;
}

export class UpdateDto {
  @ApiProperty({
    description: 'Latitude of the location',
    example: 10.123456
  })
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty({
    description: 'Longitude of the location',
    example: 106.123456
  })
  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
