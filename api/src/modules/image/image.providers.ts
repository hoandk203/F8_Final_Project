
import { DataSource } from 'typeorm';
import { Image } from './image.entity';

export const imageProviders = [
    {
        provide: 'IMAGE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Image),
        inject: ['DATA_SOURCE'],
    },
];
