
import { DataSource } from 'typeorm';
import {IdentityDocument} from "./entities/identity-document.entity";

export const identityDocumentProviders = [
    {
        provide: 'IDENTITY_DOCUMENT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(IdentityDocument),
        inject: ['DATA_SOURCE'],
    },
];
