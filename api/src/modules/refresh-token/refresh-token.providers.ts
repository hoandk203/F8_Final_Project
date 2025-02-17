
import { DataSource } from 'typeorm';
import {RefreshToken} from "./entities/refresh-token.entity";

export const refreshTokenProviders = [
    {
        provide: 'REFRESH_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(RefreshToken),
        inject: ['DATA_SOURCE'],
    },
];
