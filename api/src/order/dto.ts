import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    default: 1,
  })
  driverId: number;

  @ApiProperty({
    default: 1,
  })
  vendorId: number;


  @ApiProperty({
    default: 1,
  })
  imageId: number;

  @ApiProperty({
    default: "pending",
  })
  status: string;

  @ApiProperty({
    default: "unpaid",
  })
  paymentStatus: string;

  @ApiProperty({
    default: 1,
  })
  totalAmount: number;


}

class UpdateDto extends CreateDto {}

export { CreateDto, UpdateDto };
