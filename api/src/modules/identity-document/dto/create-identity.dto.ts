import {IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateIdentityDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsString()
    @IsNotEmpty()
    frontImageUrl: string;

    @IsString()
    @IsNotEmpty()
    backImageUrl: string;

    @IsEnum(['pending', 'approved', 'rejected'])
    @IsNotEmpty()
    status: 'pending' | 'approved' | 'rejected';
}