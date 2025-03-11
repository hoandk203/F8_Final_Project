import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import { DriverService } from './driver.service';
import {CreateDriverDto} from "./dto/create-driver.dto";
import {UpdateDriverDto} from "./dto/update-driver.dto";

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() data: CreateDriverDto) {
    return this.driverService.create(data);
  }

  @Get()
  getAll(){
    return this.driverService.getList();
  }

  @Get('/search')
  search(@Query('name') name: string) {
    return this.driverService.searchByName(name || "");
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.getOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.softDelete(+id);
  }
}
