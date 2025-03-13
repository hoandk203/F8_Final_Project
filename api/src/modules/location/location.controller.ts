import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './location.dto';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private locationService: LocationService) {}

    @Post()
    async create(@Body() createDto: CreateDto) {
        return this.locationService.create(createDto);
    }

    @Get('driver/:driverId')
    async findByDriverId(@Param('driverId') driverId: number) {
        return this.locationService.findByDriverId(driverId);
    }

    @Put(':driverId')
    async update(
        @Param('driverId') driverId: number,
        @Body() updateDto: UpdateDto,
    ) {
        return this.locationService.update(driverId, updateDto);
    }

    @Delete(':driverId')
    async delete(@Param('driverId') driverId: number) {
        return this.locationService.delete(driverId);
    }
}
