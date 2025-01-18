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
import {OrderService} from './service';

@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/')
  getAll() {
    return this.orderService.getList();
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
