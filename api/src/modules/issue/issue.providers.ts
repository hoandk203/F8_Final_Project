import { DataSource } from 'typeorm';
import { Issue } from './entities/issue.entity';

export const issueProviders = [
    {
        provide: 'ISSUE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Issue),
        inject: ['DATA_SOURCE'],
    },
]; 