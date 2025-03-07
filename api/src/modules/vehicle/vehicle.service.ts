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

    async saveBase64Image(vehicleImage: any): Promise<string> {
        try {
            const payload = vehicleImage.split(',')[1]
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
}
