import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './admin.dto';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post()
    create(@Body() createAdminDto: CreateAdminDto) {
        return this.adminService.create(createAdminDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.adminService.getByUserId(req.user.id);
    }
}
