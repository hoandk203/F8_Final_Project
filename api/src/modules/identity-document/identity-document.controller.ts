import {Body, Controller, Get, Param, Post, Put} from '@nestjs/common';
import { IdentityDocumentService } from './identity-document.service';
import {CreateIdentityDto} from "./dto/create-identity.dto";

@Controller('identity-document')
export class IdentityDocumentController {
  constructor(private readonly identityDocumentService: IdentityDocumentService) {}

  @Post()
  async create(@Body() data: CreateIdentityDto) {
    return await this.identityDocumentService.createIdentityDocument(data)
  }

  @Get('user/:userId')
  async getIdentityDocument(@Param('userId') userId: number) {
    return await this.identityDocumentService.getIdentityDocument(userId)
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any) {
    return await this.identityDocumentService.updateIdentityDocument(id, data)
  }
}
