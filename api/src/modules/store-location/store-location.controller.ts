import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './store-location.dto';
import { StoreLocationService } from './store-location.service';

@Controller('store-location')
export class StoreLocationController {
    constructor(private storeLocationService: StoreLocationService) {}

    @Post()
    async create(@Body() createDto: any) {
        return this.storeLocationService.create(createDto);
    }

    @Get('store/:storeId')
    async findByStoreId(@Param('storeId') storeId: number) {
        return this.storeLocationService.findByStoreId(storeId);
    }

    @Put(':latitude/:longitude')
    async update(
        @Param('latitude') latitude: number,
        @Param('longitude') longitude: number,
        @Body() updateDto: any,
    ) {
        return this.storeLocationService.update(latitude, longitude, updateDto);
    }

    @Delete(':latitude/:longitude')
    async delete(
        @Param('latitude') latitude: number,
        @Param('longitude') longitude: number,
    ) {
        return this.storeLocationService.delete(latitude, longitude);
    }
}
