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

@Controller('vendor')
export class VendorController {
    constructor(private vendorService: VendorService) {}

    @Get('/')
    getAll() {
        return this.vendorService.getList();
    }

    @Get(':id')
    getOne(@Param('id') id: string) {
      return this.vendorService.getOne(Number(id));
    }

    @Get('/search')

    searchByName(@Query('name') name:string)
    {
        return this.vendorService.searchByName(name || "")
    }

    @Post()
    create(@Body() vendor: CreateDto) {
        return this.vendorService.create(vendor);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() vendor: UpdateDto) {
        return this.vendorService.updateOne(Number(id), vendor);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.vendorService.softDelete(Number(id));
    }
}
