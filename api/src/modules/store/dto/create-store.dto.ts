import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class CreateStoreDto {
    @ApiProperty({
        description: 'Name of the store',
        example: 'FPT Shop Cau Giay',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Location of the store',
        example: 'So 70 Cau Giay, Quan Cau Giay',
    })
    @IsString()
    @IsNotEmpty()
    location: string;
    
    @ApiProperty({
        description: 'City of the store',
        example: 'Ha Noi',
    })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({
        description: 'Email of the store',
        example: 'fptshop.caugiay@fpt.com.vn',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({
        description: 'Phone number of the store',
        example: '0123456789',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'ID of the vendor this store belongs to',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    vendorId: number;

    @ApiProperty({
        description: 'ID of the user associated with this store',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}

export class UpdateStoreDto {
    @ApiProperty({
        description: 'Name of the store',
        example: 'FPT Shop Cau Giay',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Location of the store',
        example: 'So 70 Cau Giay, Quan Cau Giay',
    })
    @IsString()
    @IsNotEmpty()
    location: string;
    
    @ApiProperty({
        description: 'City of the store',
        example: 'Ha Noi',
    })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({
        description: 'Email of the store',
        example: 'fptshop.caugiay@fpt.com.vn',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({
        description: 'Phone number of the store',
        example: '0123456789',
    })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({
        description: 'ID of the vendor this store belongs to',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    vendorId: number;
}
