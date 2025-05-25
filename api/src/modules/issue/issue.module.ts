import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { IssueController } from './issue.controller';
import { DatabaseModule } from '../../database.module';
import { issueProviders } from './issue.providers';
import {DriverModule} from "../driver/driver.module";
import { UsersModule } from '../users/users.module';
import { ImageModule } from '../image/image.module';
@Module({
    imports: [DatabaseModule, DriverModule, UsersModule, ImageModule],
    controllers: [IssueController],
    providers: [
        ...issueProviders,
        IssueService
    ],
    exports: [IssueService]
})
export class IssueModule {}
