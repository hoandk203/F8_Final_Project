import {Body, Controller, Post} from '@nestjs/common';
import { DriverService } from './driver.service';
import {CreateDriverDto} from "./dto/create-driver.dto";

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(@Body() data: CreateDriverDto) {
    return this.driverService.create(data);
  }
}
