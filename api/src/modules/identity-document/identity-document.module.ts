import { Module } from '@nestjs/common';

import { IdentityDocumentController } from './identity-document.controller';
import {DatabaseModule} from "../../database.module";
import {identityDocumentProviders} from "./identity-document.providers";
import {IdentityDocumentService} from "./identity-document.service";

@Module({
  imports: [DatabaseModule],
  controllers: [IdentityDocumentController],
  providers: [
    ...identityDocumentProviders,
    IdentityDocumentService
  ],
})
export class IdentityDocumentModule {}
