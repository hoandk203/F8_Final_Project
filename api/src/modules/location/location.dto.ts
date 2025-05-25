import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    default: 123,
  })
  latitude: number;

  @ApiProperty({
    default: 456,
  })
  longitude: number;

  @ApiProperty({
    default: 1,
  })
  driverId: number;
}

class UpdateDto {
  @ApiProperty({
    default: 123,
  })
  latitude: number;

  @ApiProperty({
    default: 456,
  })
  longitude: number;
}

export { CreateDto, UpdateDto };
