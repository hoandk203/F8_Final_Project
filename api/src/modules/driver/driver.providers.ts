
import { DataSource } from 'typeorm';
import {Driver} from "./entities/driver.entity";

export const driverProviders = [
    {
        provide: 'DRIVER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Driver),
        inject: ['DATA_SOURCE'],
    },
];
