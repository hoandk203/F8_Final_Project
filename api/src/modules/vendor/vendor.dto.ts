import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDto {
    @ApiProperty({
        description: 'name of vendor',
        example: 'The Gioi Di Dong',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'email of vendor',
        example: 'vendor@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'ID of the user associated with this vendor',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

export class UpdateDto {
    @ApiProperty({
        description: 'name of vendor',
        example: 'The Gioi Di Dong',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

}
