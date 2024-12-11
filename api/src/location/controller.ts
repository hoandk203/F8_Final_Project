import {
  Body,
  Get,
  Param,
  Post,
  Controller,
  Put,
  Delete,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './dto';
import { LocationService } from './service';

@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Put()
  async create_or_update(@Body() location: UpdateDto){
    return this.locationService.create_or_update(location)
  }

  // @Get(':id')
  // getOne(@Param('id') id: string) {
  //   return this.vendorService.getOne(Number(id));
  // }
  //
  // @Post()
  // create(@Body() vendor: CreateDto) {
  //   return this.vendorService.create(vendor);
  // }
  //
  // @Put(':id')
  // update(@Param('id') id: string, @Body() vendor: UpdateDto) {
  //   return this.vendorService.update(Number(id), vendor);
  // }
  //
  // @Delete(':id')
  // delete(@Param('id') id: string) {
  //   return this.vendorService.delete(Number(id));
  // }
}
