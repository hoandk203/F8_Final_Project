import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
  @ApiProperty({
    description: 'name of vendor',
    example: 'iron',
  })
  name: string;

  @ApiProperty({
    example: 100,
  })
  unitPrice: number;

}

class UpdateDto extends CreateDto {}

export { CreateDto, UpdateDto };
