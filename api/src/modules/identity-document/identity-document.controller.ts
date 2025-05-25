import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { IdentityDocumentService } from './identity-document.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto, UserUpdateIdentityDto } from './dto/update-identity.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('identity-document')
export class IdentityDocumentController {
    constructor(private readonly identityDocumentService: IdentityDocumentService) {}

    @UseGuards(JwtAuthGuard)
    @Get('user/:userId')
    async getOneByUserId(@Param('userId') userId: number) {
        return this.identityDocumentService.getOneByUserId(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getOne(@Param('id') id: number) {
        return this.identityDocumentService.getOne(id);
    }

    @Post()
    async create(@Body() createIdentityDto: CreateIdentityDto) {
        return this.identityDocumentService.createIdentityDocument(createIdentityDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/:id')
    async update(@Param('id') id: number, @Body() updateIdentityDto: UserUpdateIdentityDto) {
        return this.identityDocumentService.updateIdentityDocument(id, updateIdentityDto);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/admin/:id')
    async adminUpdateStatus(@Param('id') id: number, @Body() updateIdentityDto: UpdateIdentityDto) {
        return this.identityDocumentService.adminUpdateStatus(id, updateIdentityDto);
    }
}
