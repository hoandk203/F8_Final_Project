import {IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8)
    @MaxLength(14)
    password: string;

    @IsString()
    @IsNotEmpty()
    role: 'admin' | 'vendor' | 'driver' | 'store';

    @IsString()
    @IsNotEmpty()
    otp: string;

    @IsString()
    @ValidateIf((o) => o.role === 'vendor')
    @IsNotEmpty({ message: 'Name is required for vendor role' })
    name?: string;
}