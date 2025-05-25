import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';
import { IdentityStatus } from './create-identity.dto';

export class UserUpdateIdentityDto {
    @ApiProperty({
        description: 'Front side image of identity document in base64 format',
        example: 'data:image/jpeg;base64,...',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Front image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    frontImageUrl?: string;

    @ApiProperty({
        description: 'Back side image of identity document in base64 format',
        example: 'data:image/jpeg;base64,...',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Back image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    backImageUrl?: string;
}

export class UpdateIdentityDto {
    @ApiProperty({
        description: 'Identity document verification status',
        enum: IdentityStatus
    })
    @IsEnum(IdentityStatus)
    @IsNotEmpty()
    status: IdentityStatus;

    @ApiProperty({
        description: 'Admin note for rejection reason',
        example: 'Image is not clear enough',
        required: false
    })
    @IsString()
    @IsOptional()
    adminNote?: string;
} 