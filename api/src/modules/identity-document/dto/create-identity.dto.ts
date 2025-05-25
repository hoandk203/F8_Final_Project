import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, Matches } from 'class-validator';

export enum IdentityStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export class CreateIdentityDto {
    @ApiProperty({
        description: 'User ID',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({
        description: 'Front side image of identity document in base64 format',
        example: 'data:image/jpeg;base64,...'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Front image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    frontImageUrl: string;

    @ApiProperty({
        description: 'Back side image of identity document in base64 format',
        example: 'data:image/jpeg;base64,...'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Back image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    backImageUrl: string;

    @ApiProperty({
        description: 'Identity document verification status',
        enum: IdentityStatus,
        default: IdentityStatus.PENDING
    })
    @IsEnum(IdentityStatus)
    @IsNotEmpty()
    status: IdentityStatus;
}