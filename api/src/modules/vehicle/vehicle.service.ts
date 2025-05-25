import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {BaseService} from "../base/base.service";
import {Repository} from "typeorm";
import {Vehicle} from "./entities/vehicle.entity";
import {CreateVehicleDto} from "./dto/create-vehicle.dto";
import { ImageService } from '../image/image.service';

@Injectable()
export class VehicleService extends BaseService{
    constructor(
        @Inject('VEHICLE_REPOSITORY')
        private readonly vehicleRepository: Repository<Vehicle>,
        private readonly imageService: ImageService,
    ) {
        super(vehicleRepository);
    }

    async getVehicleById(id: number): Promise<Vehicle> {
        return await this.vehicleRepository.findOne({ where: { id } });
    }

    async createVehicle(data: CreateVehicleDto): Promise<Vehicle> {
        const vehicleImage = await this.imageService.uploadBase64Image(data.vehicleImage, 'vehicle');
        const vehicleRCImage = await this.imageService.uploadBase64Image(data.vehicleRCImage, 'vehicle');

        const vehicle = this.vehicleRepository.create({
            driverId: data.driverId,
            vehiclePlateNumber: data.vehiclePlateNumber,
            vehicleColor: data.vehicleColor,
            vehicleImage,
            vehicleRCImage,
            status: data.status,
        });

        return await this.vehicleRepository.save(vehicle);
    }

    async getVehicleInfo(driverId: number): Promise<Vehicle> {
        return await this.vehicleRepository.findOne({ where: { driverId } });
    }

    async updateVehicle(id: number, data: any): Promise<Vehicle> {
        const vehicle = await this.vehicleRepository.findOne({ where: { id } });
        if (!vehicle) {
            throw new Error('Vehicle not found');
        }

        let vehicleImageUrl = vehicle.vehicleImage;
        let vehicleRCImageUrl = vehicle.vehicleRCImage;

        if(vehicle.vehicleImage !== data.vehicleImage){
            vehicleImageUrl = await this.imageService.uploadBase64Image(data.vehicleImage, 'vehicle');
        }

        if(vehicle.vehicleRCImage !== data.vehicleRCImage){
            vehicleRCImageUrl = await this.imageService.uploadBase64Image(data.vehicleRCImage, 'vehicle');
        }

        await this.vehicleRepository.update(id, {
            vehicleImage: vehicleImageUrl,
            vehicleRCImage: vehicleRCImageUrl,
            vehiclePlateNumber: data.vehiclePlateNumber,
            vehicleColor: data.vehicleColor,
            status: "pending",
            modifiedAt: new Date(),
        });
        return await this.vehicleRepository.findOne({ where: { id } });
    }

    async updateVehicleStatus(id: number, updateVehicleDto: any) {
        const vehicle = await this.vehicleRepository.findOne({
            where: { id },
        });

        if (!vehicle) {
            throw new NotFoundException(`Vehicle with ID ${id} not found`);
        }
        try {
            await this.vehicleRepository.update(id, {
                ...updateVehicleDto,
                modifiedAt: new Date(),
            })
            return {
                success: true,
                message: 'Vehicle updated successfully',
            };
        }catch (e) {
            console.log("update vehicle",e)
            throw new BadRequestException('Failed to update vehicle');
        }
    }
}
