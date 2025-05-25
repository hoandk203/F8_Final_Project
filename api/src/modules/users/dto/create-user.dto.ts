import {IsEmail, IsNotEmpty, IsString, MaxLength, MinLength} from 'class-validator';

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
    role: 'admin' | 'vendor' | 'driver';

    @IsString()
    @IsNotEmpty()
    otp: string;

}