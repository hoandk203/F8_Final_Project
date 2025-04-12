import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { IssueService } from './issue.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@Controller('issues')
@UseGuards(JwtAuthGuard)
export class IssueController {
    constructor(private readonly issueService: IssueService) {}


    @Get('search')
    search(@Query('name') name: string) {
        return this.issueService.adminSearchIssueByName(name);
    }

    @Get('store/search')
    storeSearch(@Query('name') name: string, @Query('storeId') storeId: string) {
        return this.issueService.storeSearchIssueByName(name, +storeId);
    }

    @Post()
    create(@Body() createIssueDto: CreateIssueDto) {
        return this.issueService.create(createIssueDto);
    }

    @Get()
    findAll() {
        return this.issueService.findAll();
    }

    @Get('store/:storeId')
    findByStore(@Param('storeId') storeId: string) {
        return this.issueService.findByStore(+storeId);
    }

    @Get('driver/:driverId')
    findByDriver(@Param('driverId') driverId: string) {
        return this.issueService.findByDriver(+driverId);
    }

    @Get('order/:orderId')
    findByOrder(@Param('orderId') orderId: string) {
        return this.issueService.findByOrder(+orderId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.issueService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
        return this.issueService.update(+id, updateIssueDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.issueService.remove(+id);
    }

}
