import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DatabaseModule } from '../../database.module';
import { adminProviders } from './admin.providers';

@Module({
    imports: [DatabaseModule],
    controllers: [AdminController],
    providers: [
        ...adminProviders,
        AdminService
    ],
    exports: [AdminService]
})
export class AdminModule {}
