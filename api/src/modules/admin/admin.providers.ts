import { DataSource } from 'typeorm';
import { Admin } from './admin.entity';

export const adminProviders = [
    {
        provide: 'ADMIN_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Admin),
        inject: ['DATA_SOURCE'],
    },
]; 