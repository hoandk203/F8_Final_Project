import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, Length, Matches, MaxLength } from 'class-validator';

export enum VehicleStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

export class CreateVehicleDto {
    @ApiProperty({
        description: 'Driver ID',
        example: 1
    })
    @IsNumber()
    @IsNotEmpty()
    driverId: number;

    @ApiProperty({
        description: 'Vehicle plate number',
        example: 'ABC-123'
    })
    @IsString()
    @IsNotEmpty()
    @Length(5, 10)
    @Matches(/^[A-Z0-9-]+$/, {
        message: 'Vehicle plate number must contain only uppercase letters, numbers and hyphens'
    })
    vehiclePlateNumber: string;

    @ApiProperty({
        description: 'Vehicle color',
        example: 'Black'
    })
    @IsString()
    @IsNotEmpty()
    @Length(3, 20)
    vehicleColor: string;

    @ApiProperty({
        description: 'Vehicle image (Base64)',
        example: 'data:image/jpeg;base64,...'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5 * 1024 * 1024, { // 5MB in base64
        message: 'Vehicle image must be less than 5MB'
    })
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Vehicle image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    vehicleImage: string;

    @ApiProperty({
        description: 'Vehicle RC image (Base64)',
        example: 'data:image/jpeg;base64,...'
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(5 * 1024 * 1024, { // 5MB in base64
        message: 'Vehicle RC image must be less than 5MB'
    })
    @Matches(/^data:image\/(jpeg|png|jpg);base64,[A-Za-z0-9+/=]+$/, {
        message: 'Vehicle RC image must be a valid base64 image (JPEG, PNG, or JPG)'
    })
    vehicleRCImage: string;

    @ApiProperty({
        description: 'Vehicle verification status',
        enum: VehicleStatus,
        default: VehicleStatus.PENDING
    })
    @IsEnum(VehicleStatus)
    @IsNotEmpty()
    status: VehicleStatus;
}