import { Module } from '@nestjs/common';

import { IdentityDocumentController } from './identity-document.controller';
import {DatabaseModule} from "../../database.module";
import {identityDocumentProviders} from "./identity-document.providers";
import {IdentityDocumentService} from "./identity-document.service";
import { DriverModule } from '../driver/driver.module';
import { ImageModule } from '../image/image.module';
@Module({
  imports: [DatabaseModule, DriverModule, ImageModule],
  controllers: [IdentityDocumentController],
  providers: [
    ...identityDocumentProviders,
    IdentityDocumentService
  ],
  exports: [IdentityDocumentService]
})
export class IdentityDocumentModule {}
