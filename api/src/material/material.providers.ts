
import { DataSource } from 'typeorm';
import { Material } from './entity';

export const materialProviders = [
    {
        provide: 'MATERIAL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Material),
        inject: ['DATA_SOURCE'],
    },
];
