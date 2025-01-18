
import { DataSource } from 'typeorm';
import { Order } from './entity';

export const orderProviders = [
    {
        provide: 'ORDER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
        inject: ['DATA_SOURCE'],
    },
];
