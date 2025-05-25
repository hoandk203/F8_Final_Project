import {Body, Controller, Post, Get, Param, Put} from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { AdminUpdateVehicleDto, UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get('driver/:driverId')
  async getVehicleInfo(@Param('driverId') driverId: number) {
    return this.vehicleService.getVehicleInfo(driverId);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.updateVehicle(id, updateVehicleDto);
  }

  @Put('admin/:id')
  async updateVehicleStatus(@Param('id') id: number, @Body() updateVehicleDto: AdminUpdateVehicleDto) {
    return this.vehicleService.updateVehicleStatus(id, updateVehicleDto);
  }

  @Get(':id')
  async getVehicleById(@Param('id') id: number) {
    return this.vehicleService.getVehicleById(id);
  }
}
