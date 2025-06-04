import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, Length, Matches, IsEnum } from 'class-validator';

export class CreateDriverDto {
    @ApiProperty({
        description: 'User ID',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @ApiProperty({
        description: 'Identity Document ID',
        example: 1
    })
    @IsNotEmpty()
    @IsNumber()
    identityDocumentId: number;

    @ApiProperty({
        description: 'Full name of the driver',
        example: 'John Doe'
    })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    fullname: string;

    @ApiProperty({
        description: 'Date of birth',
        example: '1990-01-01'
    })
    @IsNotEmpty()
    @IsDateString()
    dateOfBirth: string;

    @ApiProperty({
        description: 'GST number',
        example: 'GST123456789'
    })
    @IsNotEmpty()
    @IsString()
    @Length(1, 15)
    gstNumber: string;

    @ApiProperty({
        description: 'Address',
        example: '123 Main St'
    })
    @IsNotEmpty()
    @IsString()
    @Length(2, 200)
    address: string;

    @ApiProperty({
        description: 'City',
        example: 'New York'
    })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    city: string;

    @ApiProperty({
        description: 'Country',
        example: 'USA'
    })
    @IsNotEmpty()
    @IsString()
    @Length(2, 50)
    country: string;

    @ApiProperty({
        description: 'Phone number',
        example: '1234567890',
        required: false
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @ApiProperty({
        description: 'Driver status',
        example: 'idle',
        enum: ['idle', 'busy'],
        default: 'idle'
    })
    @IsOptional()
    @IsEnum(['idle', 'busy'])
    status?: 'idle' | 'busy';
}