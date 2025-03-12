import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete, Query,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './vendor.dto';
import { VendorService } from './vendor.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('vendor')
@Controller('vendor')
export class VendorController {
    constructor(private vendorService: VendorService) {}

    @Get()
    getAll() {
        return this.vendorService.getList();
    }

    @ApiOperation({ summary: 'Lấy danh sách vendor với chỉ id và name' })
    @ApiResponse({ status: 200, description: 'Trả về danh sách vendor với id và name' })
    @Get('/list-for-store')
    getVendorListForStore() {
        return this.vendorService.getVendorListForStore();
    }

    @Get('search')
    searchByName(@Query('name') name: string) {
        return this.vendorService.searchByName(name || "");
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        // Kiểm tra id có phải là số hợp lệ không
        const vendorId = Number(id);
        if (isNaN(vendorId)) {
            return { error: 'Invalid ID format' };
        }
        return this.vendorService.getOne(vendorId);
    }

    @Post()
    create(@Body() vendor: CreateDto) {
        return this.vendorService.create(vendor);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() vendor: UpdateDto) {
        // Kiểm tra id có phải là số hợp lệ không
        const vendorId = Number(id);
        if (isNaN(vendorId)) {
            return { error: 'Invalid ID format' };
        }
        return this.vendorService.updateOne(vendorId, vendor);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        // Kiểm tra id có phải là số hợp lệ không
        const vendorId = Number(id);
        if (isNaN(vendorId)) {
            return { error: 'Invalid ID format' };
        }
        return this.vendorService.softDelete(vendorId);
    }
}
