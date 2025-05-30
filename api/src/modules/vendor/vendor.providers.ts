
import { DataSource } from 'typeorm';
import { Vendor } from './vendor.entity';

export const vendorProviders = [
    {
        provide: 'VENDOR_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Vendor),
        inject: ['DATA_SOURCE'],
    },
];
