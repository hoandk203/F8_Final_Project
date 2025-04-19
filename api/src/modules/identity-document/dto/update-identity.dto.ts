import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateIdentityDto {
    @IsString()
    @IsOptional()
    frontImageUrl?: string;

    @IsString()
    @IsOptional()
    backImageUrl?: string;

    @IsEnum(['pending', 'approved', 'rejected'])
    @IsOptional()
    status?: 'pending' | 'approved' | 'rejected';
} 