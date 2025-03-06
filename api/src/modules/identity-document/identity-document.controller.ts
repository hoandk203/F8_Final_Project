import {Body, Controller, Post} from '@nestjs/common';
import { IdentityDocumentService } from './identity-document.service';
import {CreateIdentityDto} from "./dto/create-identity.dto";

@Controller('identity-document')
export class IdentityDocumentController {
  constructor(private readonly identityDocumentService: IdentityDocumentService) {}

  @Post()
  async create(@Body() data: CreateIdentityDto) {
    return await this.identityDocumentService.createIdentityDocument(data)
  }
}
