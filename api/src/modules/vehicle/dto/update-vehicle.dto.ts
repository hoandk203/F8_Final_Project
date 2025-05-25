import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Length, MaxLength, Matches } from 'class-validator';
import { VehicleStatus } from './create-vehicle.dto';

export class UpdateVehicleDto {
    @ApiProperty({
        description: 'Vehicle plate number',
        example: 'ABC-123',
        required: false,
    })
    @IsString()
    @IsOptional()
    @Length(5, 10)
    @Matches(/^[A-Z0-9-]+$/, {
        message: 'Vehicle plate number must contain only uppercase letters, numbers and hyphens'
    })
    vehiclePlateNumber?: string;

    @ApiProperty({
        description: 'Vehicle color',
        example: 'Black',
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(3, 20)
    vehicleColor?: string;

    @ApiProperty({
        description: 'Vehicle image (Base64)',
        example: 'data:image/jpeg;base64,...',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Vehicle image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    vehicleImage?: string;

    @ApiProperty({
        description: 'Vehicle RC image (Base64)',
        example: 'data:image/jpeg;base64,...',
        required: false
    })
    @IsString()
    @IsOptional()
    @MaxLength(5 * 1024 * 1024) // 5MB in base64
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Vehicle RC image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    vehicleRCImage?: string;
}

export class AdminUpdateVehicleDto {
    @ApiProperty({
        description: 'Vehicle verification status',
        enum: VehicleStatus
    })
    @IsEnum(VehicleStatus)
    @IsNotEmpty()
    status: VehicleStatus;

    @ApiProperty({
        description: 'Admin note for rejection reason',
        example: 'Vehicle documents are not clear',
        required: false
    })
    @IsString()
    @IsOptional()
    adminNote?: string;
} 