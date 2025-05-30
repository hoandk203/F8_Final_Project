import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete,
    Query,
    UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, UpdateStoreDto } from './dto/create-store.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guard/jwt-auth.guard';

@ApiTags('store')
@Controller('store')
export class StoreController {
    constructor(private readonly storeService: StoreService) {}

    @Get()
    getAll() {
        return this.storeService.getList();
    }

    @Get('/search')
    searchByName(@Query('name') name: string) {
        return this.storeService.searchByName(name || "");
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
        return this.storeService.getOne(Number(id));
    }

    @Post()
    create(@Body() store: CreateStoreDto) {
        return this.storeService.create(store);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() store: UpdateStoreDto) {
        return this.storeService.updateOne(Number(id), store);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.storeService.softDelete(Number(id));
    }

    @Get('vendor/:vendorId')
    async getStoresByVendorId(@Param('vendorId') vendorId: number) {
        return this.storeService.getStoresByVendorId(vendorId);
    }
}
