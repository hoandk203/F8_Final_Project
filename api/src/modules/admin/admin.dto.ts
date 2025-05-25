import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAdminDto {
    @ApiProperty({
        description: 'Email of admin',
        example: 'admin@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'ID of the user associated with this admin',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

export class UpdateAdminDto {
    @ApiProperty({
        description: 'Email of admin',
        example: 'admin@example.com',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
} 