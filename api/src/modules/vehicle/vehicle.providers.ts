
import { DataSource } from 'typeorm';
import {Vehicle} from "./entities/vehicle.entity";

export const vehicleProviders = [
    {
        provide: 'VEHICLE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehicle),
        inject: ['DATA_SOURCE'],
    },
];
