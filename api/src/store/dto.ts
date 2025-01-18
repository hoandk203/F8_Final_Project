import { ApiProperty } from '@nestjs/swagger';

class CreateStoreDto {
  @ApiProperty({
    default: 'Store 1',
  })
  name: string;

  @ApiProperty({
    default: 'Cay Giay, Ha Noi',
  })
  location: string;

  @ApiProperty({
    default: 'Store1@gmail.com',
  })
  email: string;

  @ApiProperty({
    default: 1,
  })
  vendorId: number;
}

class UpdateStoreDto extends CreateStoreDto {}

export { CreateStoreDto, UpdateStoreDto };
