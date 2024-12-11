
import { DataSource } from 'typeorm';
import { OrderDetail } from './entity';

export const orderDetailProviders = [
    {
        provide: 'ORDER_DETAIL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderDetail),
        inject: ['DATA_SOURCE'],
    },
];
