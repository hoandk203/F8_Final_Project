import {
    Body,
    Get,
    Param,
    Post,
    Controller,
    Put,
    Delete,
} from '@nestjs/common';
import { CreateDto, UpdateDto } from './order.dto';
import {OrderService} from './order.service';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Get('/')
    getAll() {
        return this.orderService.getList();
    }


}
