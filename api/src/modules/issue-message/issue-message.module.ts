import { Module } from '@nestjs/common';
import { IssueMessageService } from './issue-message.service';
import { IssueMessageController } from './issue-message.controller';
import { DatabaseModule } from '../../database.module';
import { issueMessageProviders } from './issue-message.providers';
import { IssueModule } from '../issue/issue.module';

@Module({
    imports: [
        DatabaseModule,
        IssueModule
    ],
    controllers: [IssueMessageController],
    providers: [
        ...issueMessageProviders,
        IssueMessageService
    ],
    exports: [IssueMessageService]
})
export class IssueMessageModule {}
