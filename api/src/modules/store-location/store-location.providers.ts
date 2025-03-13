
import { DataSource } from 'typeorm';
import {StoreLocation} from './store-location.entity';

export const storeLocationProviders = [
    {
        provide: 'STORE_LOCATION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(StoreLocation),
        inject: ['DATA_SOURCE'],
    },
];
