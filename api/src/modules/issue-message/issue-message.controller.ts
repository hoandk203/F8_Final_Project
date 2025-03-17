import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { IssueMessageService } from './issue-message.service';
import { CreateIssueMessageDto } from './dto/create-issue-message.dto';
import { UpdateIssueMessageDto } from './dto/update-issue-message.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('issues/:issueId/messages')
@UseGuards(JwtAuthGuard)
export class IssueMessageController {
    constructor(private readonly issueMessageService: IssueMessageService) {}

    @Post()
    create(
        @Param('issueId') issueId: string,
        @Body() createIssueMessageDto: CreateIssueMessageDto
    ) {
        // Đảm bảo issueId từ URL và DTO khớp nhau
        createIssueMessageDto.issueId = +issueId;
        return this.issueMessageService.create(createIssueMessageDto);
    }

    @Get()
    findAll(
        @Param('issueId') issueId: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '20'
    ) {
        return this.issueMessageService.findAllByIssueId(+issueId, +page, +limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.issueMessageService.findOne(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateIssueMessageDto: UpdateIssueMessageDto
    ) {
        // Chỉ cho phép người gửi cập nhật tin nhắn của họ
        return this.issueMessageService.update(+id, updateIssueMessageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.issueMessageService.remove(+id);
    }
}
