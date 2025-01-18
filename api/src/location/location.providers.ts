
import { DataSource } from 'typeorm';
import { Location } from './entity';

export const locationProviders = [
    {
        provide: 'LOCATION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Location),
        inject: ['DATA_SOURCE'],
    },
];
