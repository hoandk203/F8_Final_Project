import {Inject, Injectable} from '@nestjs/common';
import {BaseService} from "../base/base.service";
import {v4} from "uuid";
import {writeFile} from "fs";
import {Repository} from "typeorm";
import {Vehicle} from "./entities/vehicle.entity";
import {CreateVehicleDto} from "./dto/create-vehicle.dto";

@Injectable()
export class VehicleService extends BaseService{
    constructor(
        @Inject('VEHICLE_REPOSITORY')
        private readonly vehicleRepository: Repository<Vehicle>,
    ) {
        super(vehicleRepository);
    }

    async saveBase64Image(imageBase64: any): Promise<string> {
        try {
            const payload = imageBase64.split(',')[1]
            const fileName = `${v4()}.png`
            const path = `files/images/vehicle/${fileName}`

            writeFile(path, payload, 'base64', (e) => {
                console.log(e)
            })
            const BASE_URL = process.env.BASE_URL
            return `${BASE_URL}/image?path=files%2Fimages%2Fvehicle%2F${fileName}`;
        } catch (error) {
            console.log(error)
            throw new Error('Error saving image');
        }
    }

    async createVehicle(data: CreateVehicleDto): Promise<Vehicle> {
        const vehicleImage = await this.saveBase64Image(data.vehicleImage);
        const vehicleRCImage = await this.saveBase64Image(data.vehicleRCImage);

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

        let vehicleImageUrl:string
        let vehicleRCImageUrl:string
        if(vehicle.vehicleImage !== data.vehicleImage){
            vehicleImageUrl = await this.saveBase64Image(data.vehicleImage);
        }

        if(vehicle.vehicleRCImage !== data.vehicleRCImage){
            vehicleRCImageUrl = await this.saveBase64Image(data.vehicleRCImage);
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
}
