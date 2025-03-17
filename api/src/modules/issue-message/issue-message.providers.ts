import { DataSource } from 'typeorm';
import { IssueMessage } from './entities/issue-message.entity';

export const issueMessageProviders = [
    {
        provide: 'ISSUE_MESSAGE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(IssueMessage),
        inject: ['DATA_SOURCE'],
    },
]; 