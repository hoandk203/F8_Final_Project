import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import { DriverService } from './driver.service';
import {CreateDriverDto} from "./dto/create-driver.dto";

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driverService.getOne(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.driverService.softDelete(+id);
  }

}
