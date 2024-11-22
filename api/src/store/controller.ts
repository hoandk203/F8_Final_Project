import {
  Body,
  Get,
  Param,
  Post,
  Controller,
  Put,
  Delete,
} from '@nestjs/common';
import { StoreService } from './service';
import { CreateStoreDto, UpdateStoreDto } from './dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  getAll() {
    return this.storeService.getListStore();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.storeService.getStore(Number(id));
  }

  @Post()
  create(@Body() store: CreateStoreDto) {
    return this.storeService.createStore(store);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() store: UpdateStoreDto) {
    return this.storeService.updateStore(Number(id), store);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.storeService.deleteStore(Number(id));
  }
}
