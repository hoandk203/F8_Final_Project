import { ApiProperty } from '@nestjs/swagger';

class CreateDto {
    @ApiProperty({
        description: 'name of vendor',
        example: 'Hoan',
    })
    name: string;

    @ApiProperty({
        default: 'hoan1@gmail.com',
    })
    email: string;
}

class UpdateDto extends CreateDto {}

export { CreateDto, UpdateDto };
