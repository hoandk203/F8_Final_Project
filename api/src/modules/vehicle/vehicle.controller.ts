import {Body, Controller, Post} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import {CreateVehicleDto} from "./dto/create-vehicle.dto";

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }
}
