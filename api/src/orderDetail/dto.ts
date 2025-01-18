import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    default: 1,
  })
  orderId: number;

  @ApiProperty({
    default: 1,
  })
  materialId: number;


  @ApiProperty({
    default: 10,
  })
  weight: number;

  @ApiProperty({
    default: 1000,
  })
  amount: number;
}

class UpdateDto extends CreateDto {}

export { CreateDto, UpdateDto };
