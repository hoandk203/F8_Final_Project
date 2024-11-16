import { ApiProperty } from '@nestjs/swagger';

class CreateStoreDto {
  @ApiProperty({
    default: 'Dien may xanh Cau Giay',
  })
  name: string;

  @ApiProperty({
    default: 'Cay Giay, Ha Noi',
  })
  location: string;
}

class UpdateStoreDto extends CreateStoreDto {}

export { CreateStoreDto, UpdateStoreDto };
