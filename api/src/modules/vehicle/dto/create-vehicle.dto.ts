import {IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateVehicleDto {
    @IsNumber()
    @IsNotEmpty()
    driverId: number;

    @IsString()
    @IsNotEmpty()
    vehiclePlateNumber: string;

    @IsString()
    @IsNotEmpty()
    vehicleColor: string;

    @IsString()
    @IsNotEmpty()
    vehicleImage: string;

    @IsString()
    @IsNotEmpty()
    vehicleRCImage: string;

    @IsEnum(['pending', 'approved', 'rejected'])
    @IsNotEmpty()
    status: 'pending' | 'approved' | 'rejected';
}