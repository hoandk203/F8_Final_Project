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

  @Get('payment-result')
  paymentResult(@Query() query) {
    // Xử lý logic hiển thị kết quả thanh toán của driver
    // Bạn có thể lấy các tham số như orderId, status từ query
    return {
      orderId: query.orderId,
      status: query.status,
      message: 'Payment result page',
    };
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
